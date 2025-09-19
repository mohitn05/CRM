import random
import uuid
from datetime import datetime, timedelta, timezone
import traceback
import logging

import bcrypt
from flask import Blueprint, jsonify, request
from sqlalchemy import or_
from werkzeug.security import check_password_hash, generate_password_hash

from app.db import db
from app.models.password_reset import PasswordResetRequest
from app.models.student import StudentApplication

login_bp = Blueprint("login", __name__)

# Set up logging
logger = logging.getLogger(__name__)

# 🔧 Test route
@login_bp.route("/test", methods=["GET"])
def test_route():
    return jsonify({"message": "Login blueprint is working!"})


# 🔐 Login endpoint
@login_bp.route("/intern/login", methods=["POST"])
def login():
    try:
        logger.info("Login request received")
        data = request.get_json(force=True)
        logger.info(f"Request data: {data}")
        email_or_phone = data.get("emailOrPhone")
        password = data.get("password")

        if not email_or_phone or not password:
            logger.warning("Missing email or password")
            return jsonify({"message": "Email and password are required"}), 400

        logger.info(f"Searching for user with email or phone: {email_or_phone}")
        user = StudentApplication.query.filter(
            or_(
                StudentApplication.email == email_or_phone,
                StudentApplication.phone == email_or_phone,
            )
        ).first()
        
        logger.info(f"User found: {user}")

        if user and check_password_hash(user.password, password):
            logger.info("Login successful")
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

        logger.warning("Invalid email or password")
        return jsonify({"message": "Invalid email or password"}), 401

    except Exception as e:
        logger.error(f"Server error in login: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({"message": "Server error"}), 500


# ✉️ OTP Request route
@login_bp.route("/request-otp", methods=["POST"])
def request_otp():
    try:
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

        # Create PasswordResetRequest with correct parameters
        prr = PasswordResetRequest()
        prr.id = str(uuid.uuid4())
        prr.email = email
        prr.phone_submitted = phone_to_use
        prr.otp_code_hash = otp_hash
        prr.otp_expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
        prr.otp_attempts = 0
        prr.resend_count = 0
        prr.last_sent_at = datetime.now(timezone.utc)
        prr.status = "pending"
        prr.created_at = datetime.now(timezone.utc)
        prr.updated_at = datetime.now(timezone.utc)

        db.session.add(prr)
        db.session.commit()

        # Send OTP via email for both email and phone requests
        from app.services.email_sender import send_otp_email

        # Use the detailed OTP email function
        student_name = user.name if user else "User"
        email_sent = send_otp_email(email, student_name, otp)
        if email_sent:
            print("📧 OTP Sent via Email:", otp, "to", email)
        else:
            print("❌ Failed to send OTP email to", email)

        return jsonify({"message": "OTP sent"}), 200
    except Exception as e:
        logger.error(f"Error in request_otp: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({"message": "Server error"}), 500


# 🔁 OTP Resend route
@login_bp.route("/resend-otp", methods=["POST"])
def resend_otp():
    try:
        data = request.get_json()
        email = data.get("email")

        prr = (
            PasswordResetRequest.query.filter_by(email=email)
            .order_by(PasswordResetRequest.created_at.desc())
            .first()
        )

        if not prr or prr.status != "pending":
            return jsonify({"error": "No active OTP request"}), 400

        now = datetime.now(timezone.utc)

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
        from app.services.email_sender import send_otp_email

        user = StudentApplication.query.filter_by(email=email).first()
        # Use the detailed OTP email function for resend as well
        student_name = user.name if user else "User"
        email_sent = send_otp_email(email, student_name, otp)
        if email_sent:
            print("📧 Resent OTP via Email:", otp, "to", email)
        else:
            print("❌ Failed to resend OTP email to", email)

        return jsonify({"message": "OTP resent"}), 200
    except Exception as e:
        logger.error(f"Error in resend_otp: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({"message": "Server error"}), 500


# ✅ OTP Verification route
@login_bp.route("/verify-otp", methods=["POST"])
def verify_otp():
    try:
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

        if prr.otp_expires_at < datetime.now(timezone.utc):
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
        prr.updated_at = datetime.now(timezone.utc)
        db.session.commit()

        return jsonify({"message": "OTP verified"}), 200
    except Exception as e:
        logger.error(f"Error in verify_otp: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({"message": "Server error"}), 500


# 🔐 Set new password route
@login_bp.route("/set-new-password", methods=["POST"])
def set_new_password():
    try:
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
        prr.updated_at = datetime.now(timezone.utc)

        db.session.commit()

        return jsonify({"message": "Password updated successfully"}), 200
    except Exception as e:
        logger.error(f"Error in set_new_password: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({"message": "Server error"}), 500