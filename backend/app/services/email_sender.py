import os

from flask_mail import Mail, Message

mail = Mail()


def send_email(to_email: str, subject: str, body: str) -> bool:
    """Send email using Flask-Mail with Gmail configuration"""
    try:
        msg = Message(
            subject,
            sender=os.environ.get("MAIL_USERNAME", "mohitnarnaware.ams@gmail.com"),
            recipients=[to_email],
        )
        msg.body = body
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False


def send_acceptance_email(to_email: str, student_name: str, domain: str) -> bool:
    """Send professional acceptance email"""
    subject = "🎉 Congratulations! Your Internship Application Has Been Accepted"

    body = f"""Dear {student_name},

We are delighted to inform you that your internship application for the {domain} domain has been ACCEPTED! 

🎯 What This Means:
• You have been selected to join our internship program
• Your skills and potential have impressed our team
• We believe you will be a valuable addition to our organization

📋 Next Steps:
• You will receive detailed onboarding information within 24-48 hours
• Please check your email regularly for important updates
• Complete any required documentation promptly

💼 Program Details:
• Domain: {domain}
• Start Date: To be confirmed
• Duration: As per program requirements

🌟 We're excited to have you on board and look forward to working together!

If you have any questions or need to discuss your start date, please don't hesitate to reach out to us.

Best regards,
The HR Team
Aarti MultiServices PVT LTD

---
This is an automated message. Please do not reply to this email.
For inquiries, contact: hr@yourcompany.com"""

    return send_email(to_email, subject, body)


def send_rejection_email(to_email: str, student_name: str, domain: str) -> bool:
    """Send professional rejection email"""
    subject = "Application Update - Internship Program"

    body = f"""Dear {student_name},

Thank you for your interest in our internship program and for taking the time to apply for the {domain} domain position.

After careful consideration of your application, we regret to inform you that we are unable to move forward with your application at this time.

💡 What This Means:
• Your application was reviewed thoroughly by our team
• We received many qualified applications for limited positions
• This decision is not a reflection of your capabilities or potential

🔍 Moving Forward:
• We encourage you to continue developing your skills
• Consider applying for future opportunities with us
• Your interest in our organization is appreciated

📚 Growth Opportunities:
• Focus on building relevant technical skills
• Gain practical experience through projects
• Network with professionals in your field
• Consider other internship opportunities

We wish you the very best in your future endeavors and hope our paths may cross again.

Thank you again for your interest in our program.

Best regards,
The HR Team
Aarti MultiServices PVT LTD

---
This is an automated message. Please do not reply to this email.
For inquiries, contact: hr@yourcompany.com"""

    return send_email(to_email, subject, body)
