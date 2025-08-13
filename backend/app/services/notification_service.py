from datetime import datetime

from app.db import db
from app.models.notification import Notification


class NotificationService:
    @staticmethod
    def create_status_change_notification(student_id, old_status, new_status):
        """Create a notification when student status changes"""

        # Create appropriate message based on status change
        status_messages = {
            "Applied": {
                "title": "Application Received",
                "message": "Your application has been received and is being reviewed.",
                "type": "status_change",
            },
            "In Review": {
                "title": "Application Under Review",
                "message": "Great news! Your application is now under review by our team.",
                "type": "status_change",
            },
            "Selected": {
                "title": "Congratulations! You've been Selected",
                "message": "Congratulations! You have been selected for the internship program. Check your email for next steps.",
                "type": "status_change",
            },
            "Rejected": {
                "title": "Application Update",
                "message": "Thank you for your interest. Unfortunately, we cannot move forward with your application at this time.",
                "type": "status_change",
            },
            "In Training": {
                "title": "Welcome to Training!",
                "message": "Welcome to the internship program! Your training has begun. Check your email for training materials.",
                "type": "status_change",
            },
            "Completed": {
                "title": "Internship Completed",
                "message": "Congratulations on completing your internship! We hope you had a great experience.",
                "type": "status_change",
            },
        }

        if new_status in status_messages:
            notification_data = status_messages[new_status]

            notification = Notification(
                student_id=student_id,
                title=notification_data["title"],
                message=notification_data["message"],
                type=notification_data["type"],
                is_read=False,
                created_at=datetime.utcnow(),
            )

            db.session.add(notification)
            db.session.commit()

            return notification

        return None

    @staticmethod
    def get_student_notifications(student_id, unread_only=False):
        """Get all notifications for a student"""
        query = Notification.query.filter_by(student_id=student_id)

        if unread_only:
            query = query.filter_by(is_read=False)

        return query.order_by(Notification.created_at.desc()).all()

    @staticmethod
    def mark_notification_as_read(notification_id):
        """Mark a notification as read"""
        notification = Notification.query.get(notification_id)
        if notification:
            notification.is_read = True
            db.session.commit()
            return notification
        return None

    @staticmethod
    def mark_all_as_read(student_id):
        """Mark all notifications as read for a student"""
        notifications = Notification.query.filter_by(
            student_id=student_id, is_read=False
        ).all()
        for notification in notifications:
            notification.is_read = True
        db.session.commit()
        return len(notifications)

    @staticmethod
    def get_unread_count(student_id):
        """Get count of unread notifications for a student"""
        return Notification.query.filter_by(
            student_id=student_id, is_read=False
        ).count()
