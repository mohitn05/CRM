import os
import sys
import logging
from logging.config import fileConfig
from alembic import context

# -----------------------------------------------------------------------------
# 🔧 Path setup for imports
# -----------------------------------------------------------------------------
CURRENT_DIR = os.path.dirname(__file__)
BACKEND_DIR = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
PROJECT_ROOT = os.path.abspath(os.path.join(BACKEND_DIR, ".."))

# Add backend and root to sys.path so `app` can be imported
for path in [BACKEND_DIR, PROJECT_ROOT]:
    if path not in sys.path:
        sys.path.append(path)

# -----------------------------------------------------------------------------
# 🔥 Flask app + DB bootstrap
# -----------------------------------------------------------------------------
from app import create_app, db  # Requires app/__init__.py with exports
flask_app = create_app()

# 🚨 Import models to expose metadata for Alembic
import app.models  # noqa: F401

# -----------------------------------------------------------------------------
# 📄 Alembic config & logging
# -----------------------------------------------------------------------------
config = context.config
fileConfig(config.config_file_name)
logger = logging.getLogger("alembic.env")

# 🔗 DB URL injected from app config
db_url = flask_app.config.get("SQLALCHEMY_DATABASE_URI")
if not db_url:
    raise RuntimeError("Missing SQLALCHEMY_DATABASE_URI in Flask app config.")
config.set_main_option("sqlalchemy.url", db_url)

# 🎯 Target metadata for autogenerate
target_metadata = db.metadata

# -----------------------------------------------------------------------------
# 🧪 Migration methods
# -----------------------------------------------------------------------------
def run_migrations_offline():
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        compare_type=True,
        compare_server_default=True,
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Run migrations in 'online' mode."""
    from sqlalchemy import engine_from_config, pool

    def process_revision_directives(ctx, revision, directives):
        if getattr(config.cmd_opts, "autogenerate", False):
            script = directives[0]
            if script.upgrade_ops.is_empty():
                directives[:] = []
                logger.info("✅ No changes in schema detected.")

    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
        future=True,
    )

    with flask_app.app_context():
        with connectable.connect() as connection:
            context.configure(
                connection=connection,
                target_metadata=target_metadata,
                compare_type=True,
                compare_server_default=True,
                process_revision_directives=process_revision_directives,
            )
            with context.begin_transaction():
                context.run_migrations()

# -----------------------------------------------------------------------------
# 🚀 Execute migrations
# -----------------------------------------------------------------------------
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
