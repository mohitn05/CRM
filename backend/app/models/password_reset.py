import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, Integer, DateTime, text
from app import db

class PasswordResetRequest(db.Model):
    __tablename__ = 'password_reset_requests'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(120), nullable=False)
    phone_submitted = Column(String(10), nullable=False)
    otp_code_hash = Column(String(128), nullable=False)
    otp_expires_at = Column(DateTime(timezone=True), nullable=False)
    otp_attempts = Column(Integer, nullable=False, server_default="0")
    resend_count = Column(Integer, nullable=False, server_default="0")
    last_sent_at = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(16), nullable=False, server_default="pending")
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=text("NOW()"))
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=text("NOW()"))
