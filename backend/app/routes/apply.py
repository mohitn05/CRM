from flask import Blueprint, request, jsonify
from app.models.student import StudentApplication
from werkzeug.security import generate_password_hash
from werkzeug.utils import secure_filename
from app import db
from datetime import datetime
import sqlalchemy
import traceback
import os

apply_bp = Blueprint("apply", __name__)

@apply_bp.route("/apply", methods=["POST"])
def apply():
    try:
        # 🔍 Debugging logs
        print("🔹 Form Data:", request.form)
        print("🔹 Files:", request.files)

        # 📥 Extract and sanitize form fields
        name = request.form.get("name", "").strip()
        email = request.form.get("email", "").strip()
        phone = request.form.get("phone", "").strip()
        domain = request.form.get("domain", "").strip()
        password = request.form.get("password", "")
        resume = request.files.get("resume")
        print("Resume filename from frontend:",resume.filename)
        safe_filename =secure_filename(resume.filename)
        print("Sanitized (safe) filename:",safe_filename)

        # ⚠️ Validate required fields
        if not all([name, email, phone, domain, password, resume]):
            return jsonify({"message": "All fields are required"}), 400

        if len(phone) != 10 or not phone.isdigit():
            return jsonify({"message": "Invalid phone number"}), 400

        if len(password) < 6:
            return jsonify({"message": "Password must be at least 6 characters"}), 400

        # 🛡️ Hash password
        hashed_password = generate_password_hash(password)

        # 📄 Save resume securely
        upload_dir = os.path.join(os.getcwd(), "uploads")
        os.makedirs(upload_dir, exist_ok=True)
        safe_filename = secure_filename(resume.filename)
        resume_path = os.path.join(upload_dir, safe_filename)
        resume.save(resume_path)

        # 🗃️ Save to database
        application = StudentApplication(
            name=name,
            email=email,
            phone=phone,
            domain=domain,
            password=hashed_password,
            resume=safe_filename,
            status="Applied",
            date_applied=datetime.utcnow()
        )

        db.session.add(application)
        db.session.commit()
        print("✅ Application Saved:", name, email)

        return jsonify({"message": "Application received!"}), 200

    except sqlalchemy.exc.IntegrityError:
        db.session.rollback()
        print("❌ Duplicate email error")
        return jsonify({"message": "Email already exists. Please use another email"}), 400

    except Exception as e:
        db.session.rollback()
        print("❌ Internal Error:", str(e))
        traceback.print_exc()
        return jsonify({"message": "Internal Server Error", "detail": str(e)}), 500
