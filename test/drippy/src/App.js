import React, { useState } from "react";
import OpenAI from "openai";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize OpenAI client with your API key and allow usage in browser (dangerous for production!)
  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true, // ⚠️ Enable for demo/testing ONLY
  });

  const handleSubmit = async () => {
    if (!inputValue.trim()) {
      setResponseText("");
      return;
    }

    setLoading(true);
    setError(null);
    setResponseText("");

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: inputValue,
          },
        ],
      });

      const reply = completion.choices?.[0]?.message?.content ?? "No response";
      setResponseText(reply);
    } catch (err) {
      console.error("OpenAI API error:", err);
      setError("Failed to get response. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h2>OpenAI React Demo</h2>
      <input
        type="text"
        placeholder="What do you have in your mind?"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={{ width: "300px", padding: "8px" }}
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ marginLeft: 10, padding: "8px 16px" }}
      >
        {loading ? "Loading..." : "Submit"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {responseText && (
        <div style={{ marginTop: 20 }}>
          <strong>Response:</strong>
          <p>{responseText}</p>
        </div>
      )}
    </div>
  );
}

export default App;
