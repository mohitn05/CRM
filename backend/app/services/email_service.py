import os
import re
import smtplib
import socket
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import requests
from dotenv import load_dotenv
from flask import current_app

# Load environment variables
load_dotenv()


def validate_email(email: str) -> bool:
    """Free email validation without external APIs"""

    # Step 1: Basic format validation
    email_regex = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    if not re.match(email_regex, email):
        return False

    # Step 2: Check for common typos
    domain = email.split("@")[1].lower()

    # Common domain corrections
    common_domains = {
        "gmial.com": "gmail.com",
        "gmai.com": "gmail.com",
        "yahooo.com": "yahoo.com",
        "hotmial.com": "hotmail.com",
        "outlok.com": "outlook.com",
    }

    if domain in common_domains:
        print(
            f"⚠️ Possible typo: {email} (did you mean {email.split('@')[0]}@{common_domains[domain]}?)"
        )
        return False

    # Step 3: Basic domain validation (free)
    try:
        socket.gethostbyname(domain)
        return True
    except socket.gaierror:
        print(f"⚠️ Domain doesn't exist: {domain}")
        return False


def send_email(to_email, subject, body):
    """Send email using SMTP"""
    try:
        # Email configuration (you can move these to config.py)
        smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        smtp_username = os.getenv("SMTP_USERNAME", "your-email@gmail.com")
        smtp_password = os.getenv("SMTP_PASSWORD", "your-app-password")

        # Create message
        msg = MIMEMultipart()
        msg["From"] = smtp_username
        msg["To"] = to_email
        msg["Subject"] = subject

        # Add body to email
        msg.attach(MIMEText(body, "plain"))

        # Create SMTP session
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()  # Enable security
        server.login(smtp_username, smtp_password)

        # Send email
        text = msg.as_string()
        server.sendmail(smtp_username, to_email, text)
        server.quit()

        current_app.logger.info(f"Email sent successfully to {to_email}")
        return True

    except Exception as e:
        current_app.logger.error(f"Failed to send email to {to_email}: {str(e)}")
        return False


def send_otp_email(to_email, otp_code):
    """Send professional OTP email using the detailed template"""
    # For now, we need to get the student name from the database
    from app.models.student import StudentApplication
    student = StudentApplication.query.filter_by(email=to_email).first()
    student_name = student.name if student else "User"
    
    # Import the detailed OTP function from email_sender
    from app.services.email_sender import send_otp_email as send_detailed_otp
    
    # Use the detailed OTP email function
    return send_detailed_otp(to_email, student_name, otp_code)
