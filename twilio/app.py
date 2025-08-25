import os
from flask import Flask, request, jsonify
from twilio.rest import Client
from dotenv import load_dotenv
from flask_cors import CORS

# Load environment variables
load_dotenv()

# Twilio credentials from .env
account_sid = os.getenv("TWILIO_ACCOUNT_SID")
auth_token = os.getenv("TWILIO_AUTH_TOKEN")
twilio_number = os.getenv("TWILIO_PHONE_NUMBER")
my_number = os.getenv("MY_PHONE_NUMBER")

# Initialize Twilio client
client = Client(account_sid, auth_token)

app = Flask(__name__)
CORS(app)

@app.route("/send-sms", methods=["POST"])
def send_sms():
    try:
        data = request.json
        message_body = data.get("message", "This is your scheduled reminder to take your medicine. ⏰")

        message = client.messages.create(
            body=message_body,
            from_=twilio_number,
            to=my_number
        )

        return jsonify({"success": True, "sid": message.sid}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=6969, debug=True)
