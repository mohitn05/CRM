from flask import Blueprint, request, jsonify
from app.models.student import StudentApplication
import sqlalchemy
from app import db
from datetime import datetime
import traceback
import os

apply_bp = Blueprint("apply", __name__)

@apply_bp.route("/apply", methods=["POST"])
def apply():
    try:
        # Debugging logs
        print("🔹 Form Data:", request.form)
        print("🔹 Files:", request.files)
        

        # Get form fields
        name = request.form.get("name")
        email = request.form.get("email")
        phone = request.form.get("phone")
        domain = request.form.get("domain")
        password = request.form.get("password")
        resume = request.files.get("resume")

        # Validate required fields
        if not all([name, email, phone, domain, password, resume]):
            return jsonify({"message": "All fields are required"}), 400

        if len(phone) != 10 or not phone.isdigit():
            return jsonify({"message": "Invalid phone number"}), 400

        if len(password) < 6:
            return jsonify({"message": "Password must be at least 6 characters"}), 400

        # Save resume
        upload_dir = os.path.join(os.getcwd(), "uploads")
        os.makedirs(upload_dir, exist_ok=True)
        resume_path = os.path.join(upload_dir, resume.filename)
        resume.save(resume_path)

        # Save to DB
        application = StudentApplication(
            name=name,
            email=email,
            phone=phone,
            domain=domain,
            password=password,
            resume=resume.filename,
            resume_path=resume_path,
            status ="Applied",
            date_applied=datetime.utcnow()
        )
        db.session.add(application)
        db.session.commit()

        print("✅ Application Saved:", name, email)
        return jsonify({"message": "Application received!"}), 200
    
    except sqlalchemy.exc.IntegrityError as e:
        db.session.rollback()
        print("❌ Duplicate email error")
        return jsonify({"message":"Email already exists. Please use another email"}),400

    except Exception as e:
        print("❌ Internal Error", str(e))
        traceback.print_exc()
        return jsonify({"message": "Internal Server Error", "detail": str(e)}), 500
