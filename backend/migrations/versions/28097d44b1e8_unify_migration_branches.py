"""unify migration branches

Revision ID: 28097d44b1e8
Revises: create_applications_table, cca787defd19
Create Date: 2025-08-08 15:46:51.173977

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '28097d44b1e8'
down_revision = ('create_applications_table', 'cca787defd19')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
