require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // Add this line

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct:free', // free model
        messages: [
          { role: 'system', content: 'You are SecuBot, a cybersecurity expert.' },
          { role: 'user', content: message.trim() }
        ],
        temperature: 0.2,
        max_tokens: 800
      })
    });

    const data = await resp.json();

    if (!data?.choices?.length) {
      return res.json({ reply: 'No response from AI' });
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error('OpenRouter API error:', err);
    res.status(500).json({ reply: 'Error from OpenRouter: ' + err.message });
  }
});

app.get('/', (req, res) => res.send('SecuBot backend running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 SecuBot backend running on http://localhost:${PORT}`));
