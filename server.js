const express = require('express');
const { Groq } = require('groq-sdk');
require('dotenv').config();
const app = express();
const PORT = 3000;
const GROK_API_KEY = process.env.GROK_API_KEY;

app.use(express.json());
app.use(express.static('public'));

const groq = new Groq({ apiKey: GROK_API_KEY });

app.post('/chat', async (req, res) => {
    const { message } = req.body;
    const prompt = `
You are TravelBuddy, a friendly travel assistant chatbot. Your job is to:
- Suggest new places to visit
- Give approximate flight costs
- Estimate trip costs
- Recommend itineraries
- Chat in natural language

Always answer travel-related questions in a helpful, conversational tone. If the user asks for places, flights, costs, or itineraries, provide relevant information. If the user asks something else, politely redirect to travel topics.

User asked: "${message}"

==========================
OUTPUT FORMAT (MANDATORY)
==========================
Provide your answer as a single, continuous block of text. The output MUST be structured as follows:
1. A creative "Travel Recommendation Title".
2. A list of "Suggested Destinations" (with a brief reason for each).
3. "Approximate Flight Costs" (if relevant).
4. "Estimated Trip Costs" (if relevant).
5. "Recommended Itinerary" (if relevant).
6. A section titled "⭐ Travel Tips" with 2-3 helpful tips for the user.
`;

    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "system", content: "You are TravelBuddy, a world-class travel recommendation assistant." },
                { role: "user", content: prompt },
            ],
            temperature: 0.7,
        });

        const travelText = response.choices?.[0]?.message?.content || "Sorry, I couldn't generate a travel recommendation at this time.";
        res.json({ success: true, reply: travelText });
    } catch (err) {
        console.error("🔥 GROQ AI ERROR:", err);
        res.status(500).json({ success: false, reply: "The AI travel recommendation generator failed to respond. Please try again later." });
    }
});

app.listen(PORT, () => {
    console.log(`TravelBuddy server running at http://localhost:${PORT}`);
});
