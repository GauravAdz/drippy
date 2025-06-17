from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from systemMessage import sysMessages

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key=())

# System message for concise, efficient replies
SYSTEM_MESSAGE = {
    "role": "system",
    "content": sysMessages
}

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_messages = data.get('messages', [])

    # Combine system + user messages
    all_messages = [SYSTEM_MESSAGE] + user_messages

    try:
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=all_messages,
            max_tokens=150,          # Efficient response length
            temperature=0.4,         # Lower = more focused and less verbose
            top_p=1.0,
            frequency_penalty=0.5,   # Avoid repeated phrases
            presence_penalty=0.0     # Stay on topic
        )

        reply = resp.choices[0].message.content
        finish_reason = resp.choices[0].finish_reason

        if finish_reason == 'length':
            reply += "\n\n⚠️ Note: Response was cut off due to token limit."

        return jsonify({'reply': reply})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5050)
