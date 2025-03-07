import { useState } from 'react';
import axios from 'axios';

export default function Home() {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);

    const sendMessage = async () => {
        const res = await axios.post('/api/chat', { message });
        setChat([...chat, { user: message, bot: res.data.reply }]);
        setMessage('');
    };

    return (
        <div className="p-10">
            <h1 className="text-2xl">Chatbot Local</h1>
            <div>
                {chat.map((c, i) => (
                    <div key={i}>
                        <p><b>Vous:</b> {c.user}</p>
                        <p><b>Bot:</b> {c.bot}</p>
                    </div>
                ))}
            </div>
            <input
                className="border p-2"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage} className="ml-2 p-2 bg-blue-500 text-white">Envoyer</button>
        </div>
    );
}