import uuid
from datetime import datetime, timezone

from app.db import db


class PasswordResetRequest(db.Model):
    __tablename__ = "password_reset_requests"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(255), nullable=False, index=True)
    phone_submitted = db.Column(
        db.String(15), nullable=True
    )  # Store submitted phone for reference
    otp_code_hash = db.Column(db.String(128), nullable=False)
    otp_expires_at = db.Column(db.DateTime(timezone=True), nullable=False)
    otp_attempts = db.Column(db.Integer, default=0, nullable=False)
    resend_count = db.Column(db.Integer, default=0, nullable=False)
    last_sent_at = db.Column(db.DateTime(timezone=True), nullable=True)
    status = db.Column(db.String(16), default="pending", nullable=False, index=True)
    created_at = db.Column(
        db.DateTime(timezone=True), default=datetime.now(timezone.utc), nullable=False
    )
    updated_at = db.Column(
        db.DateTime(timezone=True),
        default=datetime.now(timezone.utc),
        onupdate=datetime.now(timezone.utc),
        nullable=False,
    )

    def __repr__(self):
        return f"<PasswordResetRequest {self.email}>"
