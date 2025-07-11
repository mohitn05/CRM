from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # To fix any CORS issues

# Save uploaded files to 'uploads/' directory
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/api/apply', methods=['POST'])
def apply():
    try:
        # Access form fields
        name = request.form.get('name')
        email = request.form.get('email')
        phone = request.form.get('phone')
        domain = request.form.get('domain')
        password = request.form.get('password')

        # Access uploaded file
        resume = request.files.get('resume')

        if not resume:
            return jsonify({"message": "Resume file is missing"}), 400

        # Save the file securely
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], resume.filename)
        resume.save(filepath)

        print("✅ Received Application:")
        print("Name:", name)
        print("Email:", email)
        print("Phone:", phone)
        print("Domain:", domain)
        print("Password:", password)
        print("Resume saved to:", filepath)

        return jsonify({"message": "Application submitted successfully!"}), 200

    except Exception as e:
        print("❌ Error:", str(e))
        return jsonify({"message": "Something went wrong", "error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
