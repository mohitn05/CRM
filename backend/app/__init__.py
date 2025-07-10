from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from .db import db
from .routes.admin import admin_bp
from .routes.apply import apply_bp
from dotenv import load_dotenv
import os

migrate = Migrate()

def create_app():
    load_dotenv()
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    migrate.init_app(app, db)

    CORS(app)

    # Register routes
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(apply_bp, url_prefix='/')

    return app
