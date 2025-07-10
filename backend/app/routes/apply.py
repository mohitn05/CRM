from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from app.models.student import Student
from app.controllers.notifications import send_notification
from app.db import db
import os

apply_bp = Blueprint('apply', __name__)

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@apply_bp.route('/apply', methods=['POST'])
def apply():
    name = request.form.get('name')
    email = request.form.get('email')
    phone = request.form.get('phone')
    domain = request.form.get('domain')
    resume_file = request.files.get('resume')

    # Check for all required fields
    if not all([name, email, phone, domain, resume_file]):
        return jsonify({'error': 'All fields are required'}), 400

    # Save resume
    filename = secure_filename(resume_file.filename)
    resume_path = os.path.join(UPLOAD_FOLDER, filename)
    resume_file.save(resume_path)

    # Create student object
    student = Student(
        name=name,
        email=email,
        phone=phone,
        domain=domain,
        resume_name=filename,
        resume_path=resume_path,
        status="Applied"
    )

    db.session.add(student)
    db.session.commit()

    # Send notification
    send_notification(email, phone, name, "Applied")

    return jsonify({'message': 'Application submitted successfully'}), 201
