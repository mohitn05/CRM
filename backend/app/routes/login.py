from flask import Blueprint, request, jsonify
from sqlalchemy import or_
from app.models.student import StudentApplication  # Your login model
from app.models.password_reset import PasswordResetRequest  # For OTP (adjust import if needed)
from app import db
from werkzeug.security import check_password_hash
import bcrypt, uuid, random
from datetime import datetime, timedelta

login_bp = Blueprint("login", __name__)

# 🔧 Test route
@login_bp.route("/test", methods=["GET"])
def test_route():
    print("🔥 TEST ROUTE CALLED!")
    return jsonify({"message": "Login blueprint is working!"})

# 🔐 Login endpoint
@login_bp.route("/intern/login", methods=["POST"])
def login():
    try:
        print("🔥 LOGIN ROUTE CALLED!")
        data = request.get_json(force=True)
        print("🔥 Login Data Received:", data)

        email_or_phone = data.get("emailOrPhone")
        password = data.get("password")

        if not email_or_phone or not password:
            print("Missing email or password")
            return jsonify({"message": "Email and password are required"}), 400

        user = StudentApplication.query.filter(
            or_(
                StudentApplication.email == email_or_phone,
                StudentApplication.phone == email_or_phone
            )
        ).first()

        if user:
            print("user Found:", user.email)
            print("Stored password hash:", user.password)
            print("Provided password:", password)
            print("Password check result:", check_password_hash(user.password, password))
        else:
            print("No user found with email/phone:", email_or_phone)

        if user and check_password_hash(user.password, password):
            print("✅ Login successful for:", user.email)
            return jsonify({
                "message": "Login successful",
                "student": {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "phone": user.phone,
                    "domain": user.domain,
                    "status": user.status,
                    "dateRegistered": user.date_applied.isoformat() if user.date_applied else None
                }
            }), 200

        print("❌ Invalid credentials for:", email_or_phone)
        return jsonify({"message": "Invalid email or password"}), 401

    except Exception as e:
        print("Exception:", str(e))
        return jsonify({"message": "Server error"}), 500

# ✉️ OTP Request route
@login_bp.route("/api/request-otp", methods=["POST"])
def request_otp():
    data = request.get_json()
    email = data.get("email")
    phone = data.get("phone")

    if not email or not phone:
        return jsonify({"error": "Missing email or phone"}), 400

    otp = str(random.randint(100000, 999999))
    otp_hash = bcrypt.hashpw(otp.encode(), bcrypt.gensalt()).decode()

    prr = PasswordResetRequest(
        id=str(uuid.uuid4()),
        email=email,
        phone_submitted=phone,
        otp_code_hash=otp_hash,
        otp_expires_at=datetime.utcnow() + timedelta(minutes=10),
        otp_attempts=0,
        resend_count=0,
        last_sent_at=datetime.utcnow(),
        status="pending",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.session.add(prr)
    db.session.commit()

    print("📤 OTP Sent:", otp)  # Stub for actual SMS sender
    return jsonify({"message": "OTP sent"}), 200

# ✅ OTP Verification route
@login_bp.route("/api/verify-otp", methods=["POST"])
def verify_otp():
    data = request.get_json()
    email = data.get("email")
    otp = data.get("otp")

    prr = PasswordResetRequest.query.filter_by(email=email).order_by(PasswordResetRequest.created_at.desc()).first()

    if not prr or prr.status != "pending":
        return jsonify({"error": "No active request"}), 400

    if prr.otp_expires_at < datetime.utcnow():
        prr.status = "expired"
        db.session.commit()
        return jsonify({"error": "OTP expired"}), 400

    if bcrypt.checkpw(otp.encode(), prr.otp_code_hash.encode()):
        prr.status = "verified"
        db.session.commit()
        return jsonify({"message": "OTP verified"}), 200

    prr.otp_attempts += 1
    if prr.otp_attempts >= 5:
        prr.status = "blocked"
    db.session.commit()
    return jsonify({"error": "Incorrect OTP"}), 401
