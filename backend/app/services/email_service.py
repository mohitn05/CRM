import os
import requests
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def validate_email(email: str) -> bool:
    api_key = os.getenv("ZEROBOUNCE_API_KEY")
    url = "https://api.zerobounce.net/v2/validate"
    params = {
        "api_key": api_key,
        "email": email
    }

    try:
        response = requests.get(url, params=params)
        data = response.json()
        return data.get("status") == "valid"
    except Exception as e:
        print(f"Email validation error: {e}")
        return False

def send_email(to_email: str, subject: str, body: str) -> bool:
    sender_email = os.getenv("EMAIL_USER")
    sender_password = os.getenv("EMAIL_PASS")
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", 465))

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = to_email

    try:
        with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
            server.login(sender_email, sender_password)
            server.send_message(msg)
        print(f"Email sent to {to_email}")
        return True
    except Exception as e:
        print(f"Email sending error: {e}")
        return False
