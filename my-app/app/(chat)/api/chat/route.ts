import {
    type Message,
    createDataStreamResponse,
    smoothStream,
    streamText,
} from 'ai';
import {auth} from '@/app/(auth)/auth';
import {systemPrompt} from '@/lib/ai/prompts';
import {
    deleteChatById,
    getChatById,
    saveChat,
    saveMessages,
} from '@/lib/db/queries';
import {
    generateUUID,
    getMostRecentUserMessage,
    sanitizeResponseMessages,
} from '@/lib/utils';
import {generateTitleFromUserMessage} from '../../actions';
import {createDocument} from '@/lib/ai/tools/create-document';
import {updateDocument} from '@/lib/ai/tools/update-document';
import {requestSuggestions} from '@/lib/ai/tools/request-suggestions';
import {getWeather} from '@/lib/ai/tools/get-weather';
import {isProductionEnvironment} from '@/lib/constants';
import {NextResponse} from 'next/server';
import {myProvider} from '@/lib/ai/providers';

export const maxDuration = 60;

export async function POST(request: Request) {
    try {
        console.log('POST request received');
        const {
            id,
            messages,
            selectedChatModel,
        }: {
            id: string;
            messages: Array<Message>;
            selectedChatModel: string;
        } = await request.json();

        console.log('Request JSON parsed:', {id, messages, selectedChatModel});

        const session = await auth();
        console.log('Session:', session);

        if (!session || !session.user || !session.user.id) {
            return new Response('Unauthorized', {status: 401});
        }

        const userMessage = getMostRecentUserMessage(messages);
        console.log('User message:', userMessage);

        if (!userMessage) {
            return new Response('No user message found', {status: 400});
        }

        const chat = await getChatById({id});
        console.log('Chat:', chat);

        if (!chat) {
            const title = await generateTitleFromUserMessage({
                message: userMessage,
            });

            await saveChat({id, userId: session.user.id, title});
            console.log('Chat saved with title:', title);
        } else {
            if (chat.userId !== session.user.id) {
                return new Response('Unauthorized', {status: 401});
            }
        }

        await saveMessages({
            messages: [{...userMessage, createdAt: new Date(), chatId: id}],
        });
        console.log('Messages saved:', userMessage);

        return createDataStreamResponse({
            execute: (dataStream) => {
                console.log('Data stream execution started');
                const result = streamText({
                    model: myProvider.languageModel(selectedChatModel),
                    system: systemPrompt({selectedChatModel}),
                    messages,
                    maxSteps: 5,
                    experimental_generateMessageId: generateUUID,
                    experimental_activeTools:
                        selectedChatModel === 'chat-model-reasoning'
                            ? []
                            : [
                                'getWeather',
                                'createDocument',
                                'updateDocument',
                                'requestSuggestions',
                            ],
                    experimental_transform: smoothStream({chunking: 'word'}),
                    /*tools: {
                        getWeather,
                        createDocument: createDocument({session, dataStream}),
                        updateDocument: updateDocument({session, dataStream}),
                        requestSuggestions: requestSuggestions({
                            session,
                            dataStream,
                        }),
                    },*/
                    onFinish: async ({response, reasoning}) => {
                        console.log('Stream finished with response:', response, 'and reasoning:', reasoning);
                        if (session.user?.id) {
                            try {
                                console.log('Response messages:', response.messages);
                                console.log('Response messages:', JSON.stringify(response.messages, null, 2));
                                response.messages.forEach((message, index) => {
                                    console.log(`Message ${index + 1}:`, message);
                                });

                                const sanitizedResponseMessages = sanitizeResponseMessages({
                                    messages: response.messages,
                                    reasoning,
                                });

                                console.log('Sanitized response messages:', sanitizedResponseMessages);

                                if (sanitizedResponseMessages.length > 0) {
                                    await saveMessages({
                                        messages: sanitizedResponseMessages.map((message) => ({
                                            id: message.id,
                                            chatId: id,
                                            role: message.role,
                                            content: message.content,
                                            createdAt: new Date(),
                                        })),
                                    });
                                } else {
                                    console.warn('No messages to save, skipping database insert.');
                                }
                            } catch (error) {
                                console.error('Failed to save chat:', error);
                            }
                        }
                    },
                    experimental_telemetry: {
                        isEnabled: isProductionEnvironment,
                        functionId: 'stream-text',
                    },
                });

                console.log('Result:', result);

                result.consumeStream();

                result.mergeIntoDataStream(dataStream, {
                    sendReasoning: true,
                });
            },
            onError: () => {
                return 'Oops, an error occured!';
            },
        });
    } catch (error) {
        console.error('Error in POST function:', error);
        return NextResponse.json({error}, {status: 400});
    }
}

export async function DELETE(request: Request) {
    const {searchParams} = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return new Response('Not Found', {status: 404});
    }

    const session = await auth();

    if (!session || !session.user) {
        return new Response('Unauthorized', {status: 401});
    }

    try {
        const chat = await getChatById({id});

        if (chat.userId !== session.user.id) {
            return new Response('Unauthorized', {status: 401});
        }

        await deleteChatById({id});

        return new Response('Chat deleted', {status: 200});
    } catch (error) {
        return new Response('An error occurred while processing your request', {
            status: 500,
        });
    }
}
