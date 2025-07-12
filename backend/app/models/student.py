from app import db
from datetime import datetime

class StudentApplication(db.Model):
    __tablename__ = "applications"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    phone = db.Column(db.String(15), nullable=False)
    domain = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(128), nullable=False)  # Ideally, hash this
    resume_filename = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(50), default="Applied")
    date_registered = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<StudentApplication {self.name}>"
