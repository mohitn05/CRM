import random
import hashlib
import datetime
from flask import Blueprint, request, jsonify
from app.db import db
from app.models.password_reset import PasswordResetRequest
from app.models.student import StudentApplication
from app.services.email_sender import send_email

password_reset_bp = Blueprint("password_reset", __name__)

# Helper to generate 6-digit OTP
def generate_otp():
    return str(random.randint(100000, 999999))

# Helper to hash OTP
def hash_otp(otp):
    return hashlib.sha256(otp.encode()).hexdigest()

@password_reset_bp.route("/password-reset/request", methods=["POST"])
def request_password_reset():
    data = request.get_json()
    email = data.get("email")
    if not email:
        return jsonify({"message": "Email is required"}), 400
    student = StudentApplication.query.filter_by(email=email).first()
    if not student:
        return jsonify({"message": "No account found for this email"}), 404
    otp = generate_otp()
    otp_hash = hash_otp(otp)
    expires_at = datetime.datetime.utcnow() + datetime.timedelta(minutes=10)
    # Remove old requests
    PasswordResetRequest.query.filter_by(email=email).delete()
    db.session.commit()
    # Save new request
    reset_request = PasswordResetRequest(
        email=email,
        otp_code_hash=otp_hash,
        otp_expires_at=expires_at,
        otp_attempts=0
    )
    db.session.add(reset_request)
    db.session.commit()
    # Send OTP email
    subject = "Your Password Reset OTP"
    body = f"Your OTP code is: {otp}\nIt expires in 10 minutes."
    send_email(email, subject, body)
    return jsonify({"message": "OTP sent to email"}), 200

@password_reset_bp.route("/password-reset/verify", methods=["POST"])
def verify_otp():
    data = request.get_json()
    email = data.get("email")
    otp = data.get("otp")
    if not email or not otp:
        return jsonify({"message": "Email and OTP are required"}), 400
    req = PasswordResetRequest.query.filter_by(email=email).first()
    if not req:
        return jsonify({"message": "No reset request found"}), 404
    if req.otp_expires_at < datetime.datetime.utcnow():
        return jsonify({"message": "OTP expired"}), 400
    if req.otp_code_hash != hash_otp(otp):
        req.otp_attempts += 1
        db.session.commit()
        return jsonify({"message": "Invalid OTP"}), 400
    return jsonify({"message": "OTP verified"}), 200

@password_reset_bp.route("/password-reset/reset", methods=["POST"])
def reset_password():
    data = request.get_json()
    email = data.get("email")
    otp = data.get("otp")
    new_password = data.get("new_password")
    if not email or not otp or not new_password:
        return jsonify({"message": "Email, OTP, and new password required"}), 400
    req = PasswordResetRequest.query.filter_by(email=email).first()
    if not req:
        return jsonify({"message": "No reset request found"}), 404
    if req.otp_expires_at < datetime.datetime.utcnow():
        return jsonify({"message": "OTP expired"}), 400
    if req.otp_code_hash != hash_otp(otp):
        return jsonify({"message": "Invalid OTP"}), 400
    student = StudentApplication.query.filter_by(email=email).first()
    if not student:
        return jsonify({"message": "No account found"}), 404
    from werkzeug.security import generate_password_hash
    student.password = generate_password_hash(new_password)  # Hash password before saving
    db.session.delete(req)
    db.session.commit()
    return jsonify({"message": "Password reset successful"}), 200
