import random
import uuid
from datetime import datetime, timedelta

import bcrypt
from flask import Blueprint, jsonify, request
from sqlalchemy import or_
from werkzeug.security import check_password_hash, generate_password_hash

from app import db
from app.models.password_reset import PasswordResetRequest
from app.models.student import StudentApplication

login_bp = Blueprint("login", __name__)


# 🔧 Test route
@login_bp.route("/test", methods=["GET"])
def test_route():
    return jsonify({"message": "Login blueprint is working!"})


# 🔐 Login endpoint
@login_bp.route("/intern/login", methods=["POST"])
def login():
    try:
        data = request.get_json(force=True)
        email_or_phone = data.get("emailOrPhone")
        password = data.get("password")

        if not email_or_phone or not password:
            return jsonify({"message": "Email and password are required"}), 400

        user = StudentApplication.query.filter(
            or_(
                StudentApplication.email == email_or_phone,
                StudentApplication.phone == email_or_phone,
            )
        ).first()

        if user and check_password_hash(user.password, password):
            return (
                jsonify(
                    {
                        "message": "Login successful",
                        "student": {
                            "id": user.id,
                            "name": user.name,
                            "email": user.email,
                            "phone": user.phone,
                            "domain": user.domain,
                            "status": user.status,
                            "dateRegistered": (
                                user.date_applied.isoformat()
                                if user.date_applied
                                else None
                            ),
                        },
                    }
                ),
                200,
            )

        return jsonify({"message": "Invalid email or password"}), 401

    except Exception:
        return jsonify({"message": "Server error"}), 500


# ✉️ OTP Request route
@login_bp.route("/api/request-otp", methods=["POST"])
def request_otp():
    data = request.get_json()
    email = data.get("email")
    phone = data.get("phone")

    # Determine if user provided email or phone
    if email:
        # Find user by email
        user = StudentApplication.query.filter_by(email=email).first()
        if not user:
            return jsonify({"error": "No account found with this email"}), 404
        phone_to_use = user.phone
    elif phone:
        # Find user by phone
        user = StudentApplication.query.filter_by(phone=phone).first()
        if not user:
            return jsonify({"error": "No account found with this phone number"}), 404
        email = user.email
        phone_to_use = phone
    else:
        return jsonify({"error": "Email or phone number required"}), 400

    otp = str(random.randint(100000, 999999))
    otp_hash = bcrypt.hashpw(otp.encode(), bcrypt.gensalt()).decode()

    prr = PasswordResetRequest(
        id=str(uuid.uuid4()),
        email=email,
        phone_submitted=phone_to_use,
        otp_code_hash=otp_hash,
        otp_expires_at=datetime.utcnow() + timedelta(minutes=10),
        otp_attempts=0,
        resend_count=0,
        last_sent_at=datetime.utcnow(),
        status="pending",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )

    db.session.add(prr)
    db.session.commit()

    # Send OTP via email for both email and phone requests
    from app.services.email_service import send_email

    if data.get("email"):
        subject = "Password Reset OTP"
        body = f"Hi {user.name},\n\nYour password reset OTP code is: {otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email."
    else:
        subject = "Password Reset OTP (Phone Request)"
        body = f"Hi {user.name},\n\nYour password reset OTP code is: {otp}\n\nThis code will expire in 10 minutes.\n\nNote: You requested OTP via phone number, but we're sending it to your registered email for security.\n\nIf you didn't request this, please ignore this email."

    send_email(email, subject, body)
    print("📧 OTP Sent via Email:", otp, "to", email)

    return jsonify({"message": "OTP sent"}), 200


# 🔁 OTP Resend route
@login_bp.route("/api/resend-otp", methods=["POST"])
def resend_otp():
    data = request.get_json()
    email = data.get("email")

    prr = (
        PasswordResetRequest.query.filter_by(email=email)
        .order_by(PasswordResetRequest.created_at.desc())
        .first()
    )

    if not prr or prr.status != "pending":
        return jsonify({"error": "No active OTP request"}), 400

    now = datetime.utcnow()

    if prr.last_sent_at and (now - prr.last_sent_at).total_seconds() < 30:
        return jsonify({"error": "Please wait before resending"}), 429

    if prr.resend_count >= 3:
        return jsonify({"error": "Max resend limit reached"}), 429

    otp = str(random.randint(100000, 999999))
    otp_hash = bcrypt.hashpw(otp.encode(), bcrypt.gensalt()).decode()

    prr.otp_code_hash = otp_hash
    prr.otp_expires_at = now + timedelta(minutes=10)
    prr.last_sent_at = now
    prr.resend_count += 1
    prr.updated_at = now

    db.session.commit()

    # Send resend OTP via email
    from app.services.email_service import send_email

    user = StudentApplication.query.filter_by(email=email).first()
    subject = "Password Reset OTP (Resent)"
    body = f"Hi {user.name},\n\nYour new password reset OTP code is: {otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email."
    send_email(email, subject, body)
    print("📧 Resent OTP via Email:", otp, "to", email)

    return jsonify({"message": "OTP resent"}), 200


# ✅ OTP Verification route
@login_bp.route("/api/verify-otp", methods=["POST"])
def verify_otp():
    data = request.get_json()
    email = data.get("email")
    otp = data.get("otp")

    prr = (
        PasswordResetRequest.query.filter_by(email=email)
        .order_by(PasswordResetRequest.created_at.desc())
        .first()
    )

    if not prr or prr.status != "pending":
        return jsonify({"error": "No active request"}), 400

    if prr.otp_expires_at < datetime.utcnow():
        prr.status = "expired"
        db.session.commit()
        return jsonify({"error": "OTP expired"}), 400

    if prr.otp_attempts >= 5:
        prr.status = "blocked"
        db.session.commit()
        return jsonify({"error": "Too many incorrect attempts"}), 403

    if not bcrypt.checkpw(otp.encode(), prr.otp_code_hash.encode()):
        prr.otp_attempts += 1
        db.session.commit()
        return jsonify({"error": "Incorrect OTP"}), 401

    prr.status = "verified"
    prr.otp_attempts = 0
    prr.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify({"message": "OTP verified"}), 200


# 🔐 Set new password route
@login_bp.route("/api/set-new-password", methods=["POST"])
def set_new_password():
    data = request.get_json()
    email = data.get("email")
    new_password = data.get("newPassword")

    if not email or not new_password:
        return jsonify({"error": "Missing email or new password"}), 400

    prr = (
        PasswordResetRequest.query.filter_by(email=email)
        .order_by(PasswordResetRequest.created_at.desc())
        .first()
    )

    if not prr or prr.status != "verified":
        return jsonify({"error": "OTP not verified"}), 403

    user = StudentApplication.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "Student not found"}), 404

    user.password = generate_password_hash(new_password)
    prr.status = "used"
    prr.updated_at = datetime.utcnow()

    db.session.commit()

    return jsonify({"message": "Password updated successfully"}), 200
