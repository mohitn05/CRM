
import os
from flask import Blueprint, jsonify, request
from app.controllers.notifications import send_notification
from app.db import db
from app.models.student import StudentApplication
from app.services.email_sender import (
    send_acceptance_email,
    send_email,
    send_rejection_email,
)
from app.services.notification_service import NotificationService
from app.services.admin_notification_service import AdminNotificationService
admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/students/<int:student_id>/notifications", methods=["DELETE"])
def delete_all_student_notifications(student_id):
    from app.models.notification import Notification
    try:
        Notification.query.filter_by(student_id=student_id).delete()
        db.session.commit()
        return jsonify({"message": "All notifications deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to delete notifications", "error": str(e)}), 500


@admin_bp.route("/admin/<int:admin_id>/notifications", methods=["DELETE"])
def delete_all_admin_notifications(admin_id):
    from app.models.admin_notification import AdminNotification
    try:
        AdminNotification.query.filter_by(admin_id=admin_id).delete()
        db.session.commit()
        return jsonify({"message": "All notifications deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to delete notifications", "error": str(e)}), 500


@admin_bp.route("/admin/<int:admin_id>/notifications", methods=["POST"])
def create_admin_notification(admin_id):
    data = request.json
    title = data.get("title")
    message = data.get("message")
    type = data.get("type")
    notification = AdminNotificationService.create_notification(title, message, type, admin_id)
    return jsonify(notification.to_dict()), 201

@admin_bp.route("/admin/<int:admin_id>/notifications", methods=["GET"])
def get_admin_notifications(admin_id):
    unread_only = request.args.get("unread_only", "false").lower() == "true"
    notifications = AdminNotificationService.get_notifications(admin_id, unread_only)
    return jsonify([n.to_dict() for n in notifications]), 200

@admin_bp.route("/admin/notifications/<int:notification_id>/read", methods=["PUT"])
def mark_admin_notification_read(notification_id):
    notification = AdminNotificationService.mark_notification_as_read(notification_id)
    if notification:
        return jsonify(notification.to_dict()), 200
    return jsonify({"message": "Notification not found"}), 404

@admin_bp.route("/admin/<int:admin_id>/notifications/read-all", methods=["PUT"])
def mark_all_admin_notifications_read(admin_id):
    count = AdminNotificationService.mark_all_as_read(admin_id)
    return jsonify({"message": f"Marked {count} notifications as read"}), 200


@admin_bp.route("/admin/applications", methods=["GET"])
def get_all_applications():
    try:
        applications = StudentApplication.query.all()
        result = []
        for app in applications:
            result.append(
                {
                    "id": app.id,
                    "name": app.name,
                    "email": app.email,
                    "phone": app.phone,
                    "domain": app.domain,
                    "status": app.status,
                    "resume": f"http://localhost:5000/api/students/{app.id}/resume",
                    "resumeName": app.resume,
                    "dateApplied": (
                        app.date_applied.isoformat() if app.date_applied else None
                    ),
                }
            )
        return jsonify(result), 200
    except Exception as e:
        return (
            jsonify({"message": "Failed to fetch applications", "error": str(e)}),
            500,
        )


@admin_bp.route("/students/<int:id>", methods=["GET", "PUT", "DELETE"])
def student_detail(id):
    student = StudentApplication.query.get_or_404(id)

    if request.method == "GET":
        return jsonify(
            {
                "id": student.id,
                "name": student.name,
                "email": student.email,
                "phone": student.phone,
                "domain": student.domain,
                "status": student.status,
                "resume": (
                    f"http://localhost:5000/uploads/{student.resume}"
                    if student.resume
                    else None
                ),
                "resumeName": student.resume,
                "dateApplied": (
                    student.date_applied.isoformat() if student.date_applied else None
                ),
            }
        )

    if request.method == "PUT":
        data = request.json

        # Track if status changed for notification
        old_status = student.status

        # Update all allowed fields
        student.name = data.get("name", student.name)
        student.email = data.get("email", student.email)
        student.phone = data.get("phone", student.phone)
        student.domain = data.get("domain", student.domain)
        student.status = data.get("status", student.status)

        db.session.commit()

        # ✅ Send status update notification only if status changed
        if old_status != student.status:
            send_notification(
                student.email, student.phone, student.name, student.status
            )
            if student.status == "Selected":
                send_acceptance_email(student.email, student.name, student.domain)
            elif student.status == "Rejected":
                send_rejection_email(student.email, student.name, student.domain)
            else:
                send_email(
                    student.email,
                    "Status Updated",
                    f"Your application status has been updated to {student.status}",
                )
            # Create in-app notification
            NotificationService.create_status_change_notification(
                student.id, old_status, student.status
            )

        return (

            jsonify(
                {
                    "message": "Student updated successfully",
                    "student": {
                        "id": student.id,
                        "name": student.name,
                        "email": student.email,
                        "phone": student.phone,
                        "domain": student.domain,
                        "status": student.status,
                        "resume": f"http://localhost:5000/api/students/{student.id}/resume",
                        "resumeName": student.resume,
                        "dateApplied": (
                            student.date_applied.isoformat()
                            if student.date_applied
                            else None
                        ),
                    },
                }
            ),
            200,
        )

    if request.method == "DELETE":
        try:
            # Delete associated notifications first
            from app.models.notification import Notification

            Notification.query.filter_by(student_id=student.id).delete()

            # Delete resume file if it exists
            if student.resume and os.path.exists(f"uploads/{student.resume}"):
                os.remove(f"uploads/{student.resume}")

            # Delete the student application
            db.session.delete(student)
            db.session.commit()

            return jsonify({"message": "Application deleted successfully"}), 200
        except Exception as e:
            db.session.rollback()
            return (
                jsonify({"message": "Failed to delete application", "error": str(e)}),
                500,
            )


@admin_bp.route("/students/<int:student_id>/notifications", methods=["GET"])
def get_student_notifications(student_id):
    """Get all notifications for a student"""
    try:
        notifications = NotificationService.get_student_notifications(student_id)
        return jsonify([notification.to_dict() for notification in notifications]), 200
    except Exception as e:
        return (
            jsonify({"message": "Failed to fetch notifications", "error": str(e)}),
            500,
        )


@admin_bp.route("/notifications/<int:notification_id>/read", methods=["PUT"])
def mark_notification_read(notification_id):
    """Mark a notification as read"""
    try:
        # Try marking student notification as read
        notification = NotificationService.mark_notification_as_read(notification_id)
        if notification:
            return jsonify({"message": "Notification marked as read"}), 200

        # Try marking admin notification as read
        from app.models.admin_notification import AdminNotification
        admin_notification = AdminNotification.query.get(notification_id)
        if admin_notification:
            admin_notification.is_read = True
            db.session.commit()
            return jsonify({"message": "Admin notification marked as read"}), 200

        return jsonify({"message": "Notification not found"}), 404
    except Exception as e:
        db.session.rollback()
        return (
            jsonify({"message": "Failed to update notification", "error": str(e)}),
            500,
        )


@admin_bp.route("/students/<int:student_id>/notifications/read-all", methods=["PUT"])
def mark_all_notifications_read(student_id):
    """Mark all notifications as read for a student"""
    try:
        count = NotificationService.mark_all_as_read(student_id)
        return jsonify({"message": f"Marked {count} notifications as read"}), 200
    except Exception as e:
        return (
            jsonify({"message": "Failed to update notifications", "error": str(e)}),
            500,
        )


@admin_bp.route("/students/<int:student_id>/accept", methods=["POST"])
def accept_student(student_id):
    """Accept a student application and send professional acceptance email"""

    import logging
    try:
        student = StudentApplication.query.get_or_404(student_id)

        # Update status to Selected
        old_status = student.status
        student.status = "Selected"
        db.session.commit()

        # Send professional acceptance email
        email_sent = send_acceptance_email(student.email, student.name, student.domain)
        if not email_sent:
            logging.error(f"Failed to send acceptance email to {student.email}")

        # Send SMS notification
        send_notification(student.email, student.phone, student.name, "Selected")

        # Create in-app notification
        NotificationService.create_status_change_notification(
            student.id, old_status, "Selected"
        )

        if email_sent:
            return (
                jsonify(
                    {
                        "message": "Student accepted and notified successfully",
                        "status": "Selected",
                        "email_sent": True,
                    }
                ),
                200,
            )
        else:
            return (
                jsonify(
                    {
                        "message": "Student accepted but email notification failed",
                        "status": "Selected",
                        "email_sent": False,
                    }
                ),
                200,
            )

    except Exception as e:
        db.session.rollback()
        logging.error(f"Exception in accept_student: {e}")
        return jsonify({"message": "Failed to accept student", "error": str(e)}), 500


@admin_bp.route("/students/<int:student_id>/reject", methods=["POST"])
def reject_student(student_id):
    """Reject a student application and send professional rejection email"""

    import logging
    try:
        student = StudentApplication.query.get_or_404(student_id)

        # Update status to Rejected
        old_status = student.status
        student.status = "Rejected"
        db.session.commit()

        # Send professional rejection email
        email_sent = send_rejection_email(student.email, student.name, student.domain)
        if not email_sent:
            logging.error(f"Failed to send rejection email to {student.email}")

        # Send SMS notification
        send_notification(student.email, student.phone, student.name, "Rejected")

        # Create in-app notification
        NotificationService.create_status_change_notification(
            student.id, old_status, "Rejected"
        )

        if email_sent:
            return (
                jsonify(
                    {
                        "message": "Student rejected and notified successfully",
                        "status": "Rejected",
                        "email_sent": True,
                    }
                ),
                200,
            )
        else:
            return (
                jsonify(
                    {
                        "message": "Student rejected but email notification failed",
                        "status": "Rejected",
                        "email_sent": False,
                    }
                ),
                200,
            )

    except Exception as e:
        db.session.rollback()
        logging.error(f"Exception in reject_student: {e}")
        return jsonify({"message": "Failed to reject student", "error": str(e)}), 500
