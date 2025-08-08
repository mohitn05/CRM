"""Add password_reset_requests table

Revision ID: cca787defd19
Revises: 
Create Date: 2025-08-08 11:53:51.448929
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
import uuid
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'cca787defd19'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "password_reset_requests",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("email", sa.String(120), nullable=False),
        sa.Column("phone_submitted", sa.String(10), nullable=False),
        sa.Column("otp_code_hash", sa.String(128), nullable=False),
        sa.Column("otp_expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("otp_attempts", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("resend_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("last_sent_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("status", sa.String(16), nullable=False, server_default="pending"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
    )
    op.create_index("ix_prr_email", "password_reset_requests", ["email"])
    op.create_index("ix_prr_status", "password_reset_requests", ["status"])

def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index("ix_prr_email", table_name="password_reset_requests")
    op.drop_index("ix_prr_status", table_name="password_reset_requests")
    op.drop_table("password_reset_requests")
