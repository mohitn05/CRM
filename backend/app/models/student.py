from ..db import db
import datetime

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    domain = db.Column(db.String(50), nullable=False)
    resume_name = db.Column(db.String(255), nullable=True)
    resume_path = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(50), default="Applied", nullable=False)
    date_applied = db.Column(db.DateTime, default=datetime.datetime.utcnow)
