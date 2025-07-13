from flask import Flask
from flask_cors import CORS
from config import Config
from app.db import db
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import logging

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # Enable logging for debugging purposes
    logging.basicConfig(level=logging.INFO)
    logging.info(f"Database path: {app.config['SQLALCHEMY_DATABASE_URI']}")

    # Enable CORS for frontend API access
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Import models within app context to ensure Alembic detects them
    with app.app_context():
        from app.models import StudentApplication  # ✔ Import here for Alembic metadata registration

    # Register Blueprints
    from app.routes.apply import apply_bp
    from app.routes.login import login_bp
    from app.routes.admin import admin_bp

    app.register_blueprint(apply_bp, url_prefix="/api")
    app.register_blueprint(login_bp, url_prefix="/api")
    app.register_blueprint(admin_bp, url_prefix="/api")

    return app
