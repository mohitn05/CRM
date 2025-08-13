#!/usr/bin/env python3
"""
Test script to verify email functionality
"""

import os
import sys

from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), "app"))

from app.services.email_sender import send_acceptance_email, send_rejection_email


def test_emails():
    """Test sending acceptance and rejection emails"""

    # Test email addresses (replace with real ones for testing)
    test_email = "test@example.com"
    test_name = "John Doe"
    test_domain = "Frontend Development"

    print("Testing email functionality...")
    print(f"Test email: {test_email}")
    print(f"Test name: {test_name}")
    print(f"Test domain: {test_domain}")
    print("-" * 50)

    # Test acceptance email
    print("Testing acceptance email...")
    try:
        result = send_acceptance_email(test_email, test_name, test_domain)
        if result:
            print("✅ Acceptance email sent successfully!")
        else:
            print("❌ Acceptance email failed to send")
    except Exception as e:
        print(f"❌ Error sending acceptance email: {e}")

    print("-" * 50)

    # Test rejection email
    print("Testing rejection email...")
    try:
        result = send_rejection_email(test_email, test_name, test_domain)
        if result:
            print("✅ Rejection email sent successfully!")
        else:
            print("❌ Rejection email failed to send")
    except Exception as e:
        print(f"❌ Error sending rejection email: {e}")

    print("-" * 50)
    print("Email testing completed!")


if __name__ == "__main__":
    test_emails()
