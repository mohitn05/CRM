"""Create applications table"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic
revision = 'create_applications_table'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'applications',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('email', sa.String(length=120), nullable=False),
        sa.Column('phone', sa.String(length=10), nullable=False),
        sa.Column('domain', sa.String(length=100), nullable=False),
        sa.Column('password', sa.String(length=128), nullable=False),
        sa.Column('resume', sa.String(length=255), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=True, default='Applied'),
        sa.Column('date_applied', sa.DateTime(), nullable=True),
        sa.UniqueConstraint('email')
    )

def downgrade():
    op.drop_table('applications')
