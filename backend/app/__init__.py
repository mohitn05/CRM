import logging

from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate

from app.db import db
from app.services.email_sender import mail
from config import Config

migrate = Migrate()


def create_app():
    import os

    uploads_dir = os.path.abspath("uploads")

    app = Flask(__name__, static_folder=uploads_dir, static_url_path="/uploads")
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    # Initialize Flask-Mail
    mail.init_app(app)
    # Specify migrations directory explicitly
    migrate.init_app(app, db, directory="migrations")

    # Enable logging for debugging purposes
    logging.basicConfig(level=logging.INFO)
    logging.info(f"Database path: {app.config['SQLALCHEMY_DATABASE_URI']}")

    # Enable CORS for frontend API access
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Import models to ensure they are registered with SQLAlchemy
    from app.models import Notification, StudentApplication
    from app.models.password_reset import PasswordResetRequest
    from app.routes.admin import admin_bp

    # Register Blueprints
    from app.routes.apply import apply_bp
    from app.routes.login import login_bp
    from app.routes.password_reset import password_reset_bp

    app.register_blueprint(apply_bp, url_prefix="/api")
    app.register_blueprint(login_bp, url_prefix="/api")
    app.register_blueprint(admin_bp, url_prefix="/api")
    app.register_blueprint(password_reset_bp, url_prefix="/api")

    # Add static file serving for uploads
    import os

    from flask import send_from_directory

    @app.route("/uploads/<filename>")
    def uploaded_file(filename):
        uploads_dir = os.path.abspath("uploads")
        file_path = os.path.join(uploads_dir, filename)

        if os.path.exists(file_path):
            return send_from_directory(uploads_dir, filename)
        else:
            return "File not found", 404

    return app
