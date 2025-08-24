import os
import json
from flask import Flask, request, jsonify
# --- 1. IMPORT CORS ---
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai
from PIL import Image
import io

# Load environment variables from .env file
load_dotenv()

# --- Configuration ---
# Configure the Gemini API with your key
try:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
except AttributeError:
    print("Error: GEMINI_API_KEY not found. Please check your .env file.")
    exit()

# --- Flask App Initialization ---
app = Flask(__name__)
# --- 2. INITIALIZE CORS FOR THE APP ---
CORS(app)    

# --- Flask App Initialization ---
app = Flask(__name__)

# --- Gemini Model and Prompt Configuration ---
# This is the advanced prompt we discussed. You can customize it further.
PROMPT = """
Analyze this image of a doctor's prescription. 
Identify each medication, its dosage strength, and the frequency or instructions for taking it.
Your response MUST be a valid JSON object.
The JSON object should have a key "medications" which is an array of objects.
Each object in the array should represent one medication and have the following keys: "name", "dosage", "frequency" ,"quantity".if no quantity mentioned on img there by default 2
If you cannot find any medications because the image is blurry or the handwriting is illegible, the "medications" array should be empty, and you should add a key "reason" explaining the issue.

Example empty response:
{ "medications": [], "reason": "The handwriting is illegible." }
also do one thing if no such medicinine name exist then show the name which u are predicting also show no so sure about the medicine name consult doctors....show reason only if it unable to predict any proper medicine
"""

def is_image(file_stream):
    """Checks if a file stream is a valid image."""
    try:
        Image.open(file_stream)
        file_stream.seek(0) # Reset stream position after checking
        return True
    except IOError:
        return False

# --- API Endpoint ---
@app.route('/analyze_prescription', methods=['POST'])
def analyze_prescription():
    """
    API endpoint to analyze a prescription image.
    Expects a multipart/form-data request with a file named 'image'.
    """
    # 1. Check if an image file is present in the request
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files['image']

    # 2. Check if the filename is empty
    if file.filename == '':
        return jsonify({"error": "No image file selected"}), 400

    # 3. Read image and check if it's a valid image format
    img_bytes = file.read()
    image_stream = io.BytesIO(img_bytes)

    if not is_image(image_stream):
        return jsonify({"error": "Invalid or unsupported image format"}), 400
        
    # 4. Prepare the image for the Gemini API
    prescription_image = {
        'mime_type': file.mimetype,
        'data': img_bytes
    }

    # 5. Call the Gemini API
    try:
        # --- THIS IS THE CORRECTED LINE ---
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        
        response = model.generate_content([PROMPT, prescription_image])
        
        # 6. Extract and clean the JSON response
        response_text = response.text
        cleaned_json_str = response_text.strip().replace("```json", "").replace("```", "").strip()
        
        # 7. Parse the cleaned string into a JSON object
        data = json.loads(cleaned_json_str)
        return jsonify(data), 200

    except json.JSONDecodeError:
        return jsonify({"error": "Failed to parse AI response as JSON", "raw_response": response_text}), 500
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": "An internal error occurred while processing the image"}), 500

# --- Main execution block ---
if __name__ == '__main__':
    # Runs the Flask app on http://127.0.0.1:5000
    app.run(debug=True)