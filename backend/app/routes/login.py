from flask import Blueprint, request, jsonify
from sqlalchemy import or_
from app.models.student import StudentApplication # Make sure your model name is correct
from app import db

login_bp = Blueprint("login", __name__)

@login_bp.route("/intern/login", methods=["POST"])
def login():
 try:
    data = request.get_json(force=True)
    print("Login Data Received:",data)

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

    if user and user.password == password:
        return jsonify({
            "message": "Login successful",
            "student":{
                "id":user.id,
                "name": user.name,
                "email": user.email,
                "phone": user.phone,
                "domain": user.domain,
                "registration_date":user.date_registered
            }
        }),200
    print("Invalid credentials")
    return jsonify({"message":"Invalid email or password"}),401

 except Exception as e:
    print("Exception:",str(e))
    return jsonify({"message":"Server error"}),500