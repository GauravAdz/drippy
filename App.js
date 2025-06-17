import { useState } from 'react';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([
    { role: 'system', content: "You will try to give fun answers." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  function speak(text) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('Speech synthesis not supported in this browser.');
    }
  }

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5050/api/chat', {
        messages: newMessages
      });
      console.log('API response:', res.data);
      const reply = res.data.reply || (res.data.choices && res.data.choices[0]?.message?.content) || 'No response';
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
      speak(reply);
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to get response from server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>Chat with Drippy 🤖</h2>
      <div style={{ border: '1px solid #ccc', padding: 10, height: 400, overflowY: 'scroll' }}>
        {messages
          .filter(m => m.role !== 'system')
          .map((msg, idx) => (
            <div key={idx} style={{ margin: '10px 0' }}>
              <strong>{msg.role === 'user' ? 'You' : 'Drippy'}:</strong> {msg.content}
            </div>
          ))}
        {loading && <div><em>Drippy is typing...</em></div>}
      </div>
      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center' }}>
        <input
          style={{ flexGrow: 1, padding: 8 }}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Ask something..."
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{ padding: '8px 16px', marginLeft: 8 }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
