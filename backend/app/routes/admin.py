from flask import Blueprint, request, jsonify
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



@admin_bp.route('/students/<int:id>', methods=['GET', 'PUT', 'DELETE'])
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
            'resume': f"http://localhost:5000/uploads/{student.resume}" if student.resume else None,
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
