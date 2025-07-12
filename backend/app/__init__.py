from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)

    # Import routes from app.routes
    from app.routes.apply import apply_bp
    app.register_blueprint(apply_bp, url_prefix="/api")

    db.init_app(app)

    with app.app_context():
        db.create_all()

    return app
