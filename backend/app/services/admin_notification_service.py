from datetime import datetime
from app.db import db
from app.models.admin_notification import AdminNotification

class AdminNotificationService:
    @staticmethod
    def create_notification(title, message, type, admin_id=1):
        notification = AdminNotification(
            admin_id=admin_id,
            title=title,
            message=message,
            type=type,
            is_read=False,
            created_at=datetime.utcnow(),
        )
        db.session.add(notification)
        db.session.commit()
        return notification

    @staticmethod
    def get_notifications(admin_id=1, unread_only=False):
        query = AdminNotification.query.filter_by(admin_id=admin_id)
        if unread_only:
            query = query.filter_by(is_read=False)
        return query.order_by(AdminNotification.created_at.desc()).all()

    @staticmethod
    def mark_notification_as_read(notification_id):
        notification = AdminNotification.query.get(notification_id)
        if notification:
            notification.is_read = True
            db.session.commit()
            return notification
        return None

    @staticmethod
    def mark_all_as_read(admin_id=1):
        notifications = AdminNotification.query.filter_by(admin_id=admin_id, is_read=False).all()
        for notification in notifications:
            notification.is_read = True
        db.session.commit()
        return len(notifications)

    @staticmethod
    def get_unread_count(admin_id=1):
        return AdminNotification.query.filter_by(admin_id=admin_id, is_read=False).count()
