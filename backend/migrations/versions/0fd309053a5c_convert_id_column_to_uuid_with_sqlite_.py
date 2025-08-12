"""Convert id column to UUID with SQLite workaround

Revision ID: 0fd309053a5c
Revises: 3b1d02cfa0a5
Create Date: 2025-08-12 12:36:02.474159
"""

from alembic import op
import sqlalchemy as sa
import uuid

# revision identifiers, used by Alembic.
revision = '0fd309053a5c'
down_revision = '3b1d02cfa0a5'
branch_labels = None
depends_on = None


def upgrade():
    # ⚙️ 1. Create temp table with UUID-compatible id column (as string)
    op.create_table(
        'password_reset_requests_tmp',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('email', sa.String(length=255)),
        sa.Column('status', sa.String(length=50)),
        sa.Column('created_at', sa.DateTime()),
        sa.Column('updated_at', sa.DateTime()),
    )

    # 🔄 2. Copy existing data into temp table, casting id to string
    op.execute("""
        INSERT INTO password_reset_requests_tmp (id, email, status, created_at, updated_at)
        SELECT CAST(id AS TEXT), email, status, created_at, updated_at
        FROM password_reset_requests
    """)

    # 🧹 3. Drop old table
    op.drop_table('password_reset_requests')

    # 🔄 4. Rename temp table back to original name
    op.rename_table('password_reset_requests_tmp', 'password_reset_requests')


def downgrade():
    raise NotImplementedError("Downgrade not supported due to manual migration logic.")
