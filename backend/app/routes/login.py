from flask import Blueprint, request, jsonify
from sqlalchemy import or_
from app.models.student import StudentApplication # Make sure your model name is correct
from app import db
from werkzeug.security import check_password_hash

login_bp = Blueprint("login", __name__)

@login_bp.route("/test", methods=["GET"])
def test_route():
    print("🔥 TEST ROUTE CALLED!")
    return jsonify({"message": "Login blueprint is working!"})

@login_bp.route("/intern/login", methods=["POST"])
def login():
 try:
    print("🔥 LOGIN ROUTE CALLED!")
    data = request.get_json(force=True)
    print("🔥 Login Data Received:",data)

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
            "student":{
                "id":user.id,
                "name": user.name,
                "email": user.email,
                "phone": user.phone,
                "domain": user.domain,
                "status": user.status,
                "dateRegistered": user.date_applied.isoformat() if user.date_applied else None
            }
        }),200
    print("❌ Invalid credentials for:", email_or_phone)
    return jsonify({"message":"Invalid email or password"}),401

 except Exception as e:
    print("Exception:",str(e))
    return jsonify({"message":"Server error"}),500