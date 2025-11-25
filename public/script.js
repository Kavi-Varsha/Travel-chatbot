const chatWindow = document.getElementById('chat-window');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    if (sender === 'bot') {
        msgDiv.innerHTML = formatBotMessage(text);
    } else {
        msgDiv.textContent = text;
    }
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function formatBotMessage(text) {
    // Add emojis and section cards for unique, readable output
    let html = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\n/g, '<br>')
        .replace(/\n/g, '<br>');

    // Section headers with emojis
    html = html.replace(/<strong>(Suggested Destinations)<\/strong>:?<br>/g, '<div class="card destinations"><h4>🌍 $1</h4><ul>');
    html = html.replace(/<strong>(Approximate Flight Costs)<\/strong>:?<br>/g, '<div class="card costs"><h4>✈️ $1</h4><ul>');
    html = html.replace(/<strong>(Estimated Trip Costs)<\/strong>:?<br>/g, '<div class="card costs"><h4>💰 $1</h4><ul>');
    html = html.replace(/<strong>(Recommended Itinerary)<\/strong>:?<br>/g, '<div class="card itinerary"><h4>🗺️ $1</h4><ul>');
    html = html.replace(/<strong>(Travel Tips|⭐ Travel Tips)<\/strong>:?<br>/g, '<div class="card tips"><h4>💡 $1</h4><ul>');

    // Lists
    html = html.replace(/(\d+)\. (.+?)(?=<br>|$)/g, '<li>$2</li>');
    html = html.replace(/(\* )(.+?)(?=<br>|$)/g, '<li>$2</li>');

    // Close cards and lists
    html = html.replace(/(<\/ul>\s*)?<div class="card/g, '</ul></div><div class="card');
    if (html.includes('<ul>')) html += '</ul></div>';

    return html;
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    userInput.value = '';
    const res = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
    });
    const data = await res.json();
    addMessage(data.reply, 'bot');
});

// Welcome message
addMessage("Hi! I'm TravelBuddy. Ask me about places, flights, costs, or itineraries.", 'bot');
