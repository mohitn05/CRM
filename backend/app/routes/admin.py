from flask import Blueprint, request, jsonify, send_from_directory
from app.models.student import StudentApplication
from app.controllers.notifications import send_notification
from app.services.notification_service import NotificationService
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
             'resume': f"http://localhost:5000/api/students/{app.id}/resume",
             'resumeName': app.resume,
             'dateApplied': app.date_applied.isoformat() if app.date_applied else None
            })
        return jsonify(result),200
    except Exception as e:
        return jsonify({"message":"Failed to fetch applications","error":str(e)}), 500

@admin_bp.route('/download-resume/<int:student_id>', methods=['GET'])
def download_student_resume(student_id):
    print(f"DEBUG: download_student_resume called with student_id={student_id}")
    try:
        student = StudentApplication.query.get_or_404(student_id)
        print(f"DEBUG: Found student: {student.name}, resume: {student.resume}")

        if student.resume:
            # Use absolute path to uploads directory
            import os
            from flask import current_app
            uploads_dir = os.path.join(current_app.root_path, '..', 'uploads')
            uploads_dir = os.path.abspath(uploads_dir)
            file_path = os.path.join(uploads_dir, student.resume)
            print(f"DEBUG: Looking for file at: {file_path}")
            print(f"DEBUG: File exists: {os.path.exists(file_path)}")

            if os.path.exists(file_path):
                print(f"DEBUG: Sending file from {uploads_dir}")
                return send_from_directory(uploads_dir, student.resume, as_attachment=True)

        print("DEBUG: Resume not found")
        return jsonify({'error': 'Resume not found'}), 404
    except Exception as e:
        print(f"DEBUG: Exception in download_student_resume: {e}")
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/resume/<int:id>', methods=['GET'])
def download_resume(id):
    print(f"DEBUG: download_resume called with id={id}")
    return jsonify({'message': f'Resume download for student {id}', 'debug': 'Function called successfully'}), 200

@admin_bp.route('/students/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def student_detail(id):
    student = StudentApplication.query.get_or_404(id)

    if request.method == 'GET':
        # Check if this is a resume download request
        download_param = request.args.get('download')
        print(f"DEBUG: download parameter = {download_param}")
        if download_param == 'resume':
            print(f"DEBUG: Resume download requested for student {id}")
            if student.resume:
                # Use absolute path to uploads directory
                import os
                from flask import current_app
                uploads_dir = os.path.join(current_app.root_path, '..', 'uploads')
                uploads_dir = os.path.abspath(uploads_dir)
                file_path = os.path.join(uploads_dir, student.resume)
                print(f"DEBUG: Looking for file at: {file_path}")
                print(f"DEBUG: File exists: {os.path.exists(file_path)}")

                if os.path.exists(file_path):
                    print(f"DEBUG: Sending file from {uploads_dir}")
                    return send_from_directory(uploads_dir, student.resume, as_attachment=True)

            print("DEBUG: Resume not found")
            return jsonify({'error': 'Resume not found'}), 404

        # Regular student detail response
        return jsonify({
            'id': student.id,
            'name': student.name,
            'email': student.email,
            'phone': student.phone,
            'domain': student.domain,
            'status': student.status,
            'resume': f"http://localhost:5000/api/students/{student.id}?download=resume",
            'resumeName': student.resume,
            'dateApplied': student.date_applied.isoformat() if student.date_applied else None
        })

    if request.method == 'PUT':
        data = request.json

        # Track if status changed for notification
        old_status = student.status

        # Update all allowed fields
        student.name = data.get('name', student.name)
        student.email = data.get('email', student.email)
        student.phone = data.get('phone', student.phone)
        student.domain = data.get('domain', student.domain)
        student.status = data.get('status', student.status)

        db.session.commit()

        # ✅ Send status update notification only if status changed
        if old_status != student.status:
            send_notification(student.email, student.phone, student.name, student.status)
            # Create in-app notification
            NotificationService.create_status_change_notification(student.id, old_status, student.status)

        return jsonify({
            'message': 'Student updated successfully',
            'student': {
                'id': student.id,
                'name': student.name,
                'email': student.email,
                'phone': student.phone,
                'domain': student.domain,
                'status': student.status,
                'resume': f"http://localhost:5000/api/students/{student.id}/resume",
                'resumeName': student.resume,
                'dateApplied': student.date_applied.isoformat() if student.date_applied else None
            }
        }), 200

    if request.method == 'DELETE':
        try:
            # Delete associated notifications first
            from app.models.notification import Notification
            Notification.query.filter_by(student_id=student.id).delete()

            # Delete resume file if it exists
            if student.resume and os.path.exists(f'uploads/{student.resume}'):
                os.remove(f'uploads/{student.resume}')

            # Delete the student application
            db.session.delete(student)
            db.session.commit()

            return jsonify({"message": "Application deleted successfully"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": "Failed to delete application", "error": str(e)}), 500



@admin_bp.route('/students/<int:student_id>/notifications', methods=['GET'])
def get_student_notifications(student_id):
    """Get all notifications for a student"""
    try:
        notifications = NotificationService.get_student_notifications(student_id)
        return jsonify([notification.to_dict() for notification in notifications]), 200
    except Exception as e:
        return jsonify({"message": "Failed to fetch notifications", "error": str(e)}), 500

@admin_bp.route('/notifications/<int:notification_id>/read', methods=['PUT'])
def mark_notification_read(notification_id):
    """Mark a notification as read"""
    try:
        notification = NotificationService.mark_notification_as_read(notification_id)
        if notification:
            return jsonify({"message": "Notification marked as read"}), 200
        return jsonify({"message": "Notification not found"}), 404
    except Exception as e:
        return jsonify({"message": "Failed to update notification", "error": str(e)}), 500

@admin_bp.route('/students/<int:student_id>/notifications/read-all', methods=['PUT'])
def mark_all_notifications_read(student_id):
    """Mark all notifications as read for a student"""
    try:
        count = NotificationService.mark_all_as_read(student_id)
        return jsonify({"message": f"Marked {count} notifications as read"}), 200
    except Exception as e:
        return jsonify({"message": "Failed to update notifications", "error": str(e)}), 500
