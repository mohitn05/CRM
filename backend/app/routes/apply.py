from flask import Blueprint, request, jsonify
from app.models.student import StudentApplication
from app import db
import os

apply_bp = Blueprint("apply", __name__)

@apply_bp.route("/apply", methods=["POST"])
def apply():
    data = request.form
    resume = request.files.get("resume")

    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    domain = data.get("domain")
    password = data.get("password")

    if not all([name, email, phone, domain, password, resume]):
        return jsonify({"message": "All fields are required"}), 400

    if len(phone) != 10 or not phone.isdigit():
        return jsonify({"message": "Invalid phone number"}), 400

    if len(password) < 6:
        return jsonify({"message": "Password must be at least 6 characters"}), 400

    upload_path = os.path.join("uploads", resume.filename)
    os.makedirs("uploads", exist_ok=True)
    resume.save(upload_path)

    # Save to DB
    application = StudentApplication( 
        name=name,
        email=email,
        phone=phone,
        domain=domain,
        password=password,
        resume_filename=resume.filename,
    )
    db.session.add(application)
    db.session.commit()

    print("✅ Received application:", name, email, phone, domain)
    return jsonify({"message": "Application received!"}), 200
