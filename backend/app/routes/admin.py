from flask import Blueprint, request, jsonify, send_from_directory
from app.models.student import Student
from app.controllers.notifications import send_notification
from app.db import db
import os

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/students', methods=['GET'])
def get_students():
    students = Student.query.all()
    result = [
        {
            'id': s.id,
            'name': s.name,
            'email': s.email,
            'phone': s.phone,
            'domain': s.domain,
            'status': s.status,
            'resume': s.resume_name
        } for s in students
    ]
    return jsonify(result)

@admin_bp.route('/students/<int:id>', methods=['GET', 'PUT'])
def student_detail(id):
    student = Student.query.get_or_404(id)

    if request.method == 'GET':
        return jsonify({
            'id': student.id,
            'name': student.name,
            'email': student.email,
            'phone': student.phone,
            'domain': student.domain,
            'status': student.status,
            'resume': student.resume_name
        })

    if request.method == 'PUT':
        data = request.json
        student.status = data.get('status', student.status)
        db.session.commit()

        # ✅ Send status update notification
        send_notification(student.email, student.phone, student.name, student.status)

        return jsonify({'message': 'Student status updated'}), 200

@admin_bp.route('/students/<int:id>/resume', methods=['GET'])
def download_resume(id):
    student = Student.query.get_or_404(id)
    if student.resume_path and os.path.exists(f'uploads/{student.resume_path}'):
        return send_from_directory('uploads', student.resume_path, as_attachment=True)
    return jsonify({'error': 'Resume not found'}), 404
