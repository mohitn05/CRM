from flask import Flask
from flask_cors import CORS
from config import Config
from app.db import db
from flask_migrate import Migrate
import logging

migrate = Migrate()

def create_app():
    import os
    uploads_dir = os.path.abspath('uploads')

    app = Flask(__name__, static_folder=uploads_dir, static_url_path='/uploads')
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # Enable logging for debugging purposes
    logging.basicConfig(level=logging.INFO)
    logging.info(f"Database path: {app.config['SQLALCHEMY_DATABASE_URI']}")

    # Enable CORS for frontend API access
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Import models to ensure they are registered with SQLAlchemy
    from app.models import StudentApplication, Notification

    # Register Blueprints
    from app.routes.apply import apply_bp
    from app.routes.login import login_bp
    from app.routes.admin import admin_bp

    app.register_blueprint(apply_bp, url_prefix="/api")
    app.register_blueprint(login_bp, url_prefix="/api")
    app.register_blueprint(admin_bp, url_prefix="/api")

    # Add static file serving for uploads
    import os
    from flask import send_from_directory

    @app.route('/uploads/<filename>')
    def uploaded_file(filename):
        uploads_dir = os.path.abspath('uploads')
        file_path = os.path.join(uploads_dir, filename)

        if os.path.exists(file_path):
            return send_from_directory(uploads_dir, filename)
        else:
            return "File not found", 404

    return app
