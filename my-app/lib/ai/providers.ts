import {
    customProvider,
    extractReasoningMiddleware,
    wrapLanguageModel,
} from 'ai';
import {createOllama} from 'ollama-ai-provider';

import {isTestEnvironment} from '../constants';
import {
    artifactModel,
    chatModel,
    reasoningModel,
    titleModel,
} from './models.test';

// Créer l'instance Ollama
const ollama = createOllama({
    baseURL: 'http://ollama:11434/api',
});
console.log('Ollama instance created with settings:', ollama);

// Définition des modèles spécifiques
const chatSmall = ollama('phi3');
const chatLarge = ollama('deepseek-llm');
const reasoning = ollama('deepseek-r1');
const titleGen = ollama('llama3.2');
const artifactGen = ollama('phi3');

console.log('Models initialized:', { chatSmall, chatLarge, reasoning, titleGen, artifactGen });

export const myProvider = isTestEnvironment
    ? customProvider({
        languageModels: {
            'chat-model-small': chatModel,
            'chat-model-large': chatModel,
            'chat-model-reasoning': reasoningModel,
            'title-model': titleModel,
            'artifact-model': artifactModel,
        },
    })
    : customProvider({
        languageModels: {
            'chat-model-small': chatSmall,
            'chat-model-large': chatLarge,
            'chat-model-reasoning': wrapLanguageModel({
                model: reasoning,
                middleware: extractReasoningMiddleware({ tagName: 'think' }),
            }),
            'title-model': titleGen,
            'artifact-model': artifactGen,
        },
    });

console.log('Provider created:', myProvider);