import { useState, useRef, useEffect } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { sender: "user", text: message.trim() };
    setChat(prev => [...prev, userMsg]);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: message.trim()
      });
      const botMsg = { sender: "bot", text: res.data.reply };
      setChat(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setChat(prev => [...prev, { sender: "bot", text: "Error: couldn't reach server" }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>SecuBot AI 🤖</h1>
      <div style={{ border: "1px solid #ccc", padding: 10, height: 300, overflowY: "auto" }}>
        {chat.map((c, i) => (
          <p key={i}><b>{c.sender}:</b> {c.text}</p>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about cybersecurity..."
        style={{ width: "80%", padding: 10, marginTop: 8 }}
        rows={2}
      />
      <button onClick={sendMessage} style={{ padding: 10, marginLeft: 8 }}>Send</button>
    </div>
  );
}

export default App;
