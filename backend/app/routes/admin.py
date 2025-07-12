from flask import Blueprint, request, jsonify, send_from_directory
from app.models.student import StudentApplication
from app.controllers.notifications import send_notification
from app.db import db
import os

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin/applications', methods=['GET'])
def get_all_applications():
    try:
        applications = StudentApplication.query.all()
        result = []
        for app in applications:
            result.append({
             'id': app.id,
             'name': app.name,
             'email': app.email,
             'phone': app.phone,
             'domain': app.domain,
             'status': app.status,
             'resume': app.resume_name,
             'date_registered': app.date_registered.isoformat() if app.date_registered else None
            })
        return jsonify(result),200
    except Exception as e:
        return jsonify({"message":"Failed to fetch applications","error":str(e)}), 500

@admin_bp.route('/students/<int:id>', methods=['GET', 'PUT'])
def student_detail(id):
    student = StudentApplication.query.get_or_404(id)

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
    student = StudentApplication.query.get_or_404(id)
    if student.resume_path and os.path.exists(f'uploads/{student.resume_path}'):
        return send_from_directory('uploads', student.resume_path, as_attachment=True)
    return jsonify({'error': 'Resume not found'}), 404
