from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from app.db import db
from config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")
    CORS(app)

    # Import routes from app.routes
    from app.routes.apply import apply_bp
    app.register_blueprint(apply_bp, url_prefix="/api")

    from app.routes.login import login_bp
    app.register_blueprint(login_bp, url_prefix="/api")

    from app.routes.admin import admin_bp
    app.register_blueprint(admin_bp, url_prefix="/api")

    db.init_app(app)

    with app.app_context():
        db.create_all()

    return app
