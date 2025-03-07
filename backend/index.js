const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await axios.post('http://ollama:11434/api/generate', {
            model: 'llama3.2',
            prompt: userMessage,
            stream: false
        });

        res.json({ reply: response.data.response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur avec Ollama.' });
    }
});

app.listen(3001, () => console.log('Backend sur http://localhost:3001'));