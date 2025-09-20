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

What This Means:
You have been selected to join our internship program. Your skills and potential have impressed our team, and we believe you will be a valuable addition to our organization.

Next Steps:
You will receive detailed onboarding information within 24-48 hours. Please check your email regularly for important updates and complete any required documentation promptly.

Program Details:
• Domain: {domain}
• Start Date: To be confirmed
• Duration: As per program requirements

We're excited to have you on board and look forward to working together!

If you have any questions or need to discuss your start date, please don't hesitate to reach out to us.

Best regards,
The HR Team
Aarti Multi Services Pvt. Ltd.

---
This is an automated message. Please do not reply to this email.
For inquiries, contact: info@aartmultiservices.com"""

    return send_email(to_email, subject, body)


def send_rejection_email(to_email: str, student_name: str, domain: str) -> bool:
    """Send professional rejection email"""
    subject = "Application Update - Internship Program"

    body = f"""Dear {student_name},

Thank you for your interest in our internship program and for taking the time to apply for the {domain} domain position.

After careful consideration of your application, we regret to inform you that we are unable to move forward with your application at this time.

What This Means:
• Your application was reviewed thoroughly by our team
• We received many qualified applications for limited positions
• This decision is not a reflection of your capabilities or potential

Moving Forward:
• We encourage you to continue developing your skills
• Consider applying for future opportunities with us
• Your interest in our organization is appreciated

Growth Opportunities:
• Focus on building relevant technical skills
• Gain practical experience through projects
• Network with professionals in your field
• Consider other internship opportunities

We wish you the very best in your future endeavors and hope our paths may cross again.

Thank you again for your interest in our program.

Best regards,
The HR Team
Aarti Multi Services Pvt. Ltd.

---
This is an automated message. Please do not reply to this email.
For inquiries, contact: info@aartmultiservices.com"""

    return send_email(to_email, subject, body)


def send_in_review_email(to_email: str, student_name: str, domain: str) -> bool:
    """Send professional in review email"""
    subject = "🔍 Application Update - Under Review"

    body = f"""Dear {student_name},

We hope this message finds you well. We wanted to provide you with an important update regarding your internship application for the {domain} domain.

Current Status:
• Your application is now under review by our technical team
• Our experts are carefully evaluating your qualifications and skills
• This is a positive step in our selection process

What's Happening Now:
• Technical assessment of your resume and portfolio
• Evaluation of your domain-specific knowledge and experience
• Comparison with program requirements and expectations
• Review timeline: 3-5 business days

What to Expect Next:
• You will receive a notification once the review is complete
• Successful candidates will be contacted for the next stage
• We appreciate your patience during this evaluation period

Program Information:
• Domain: {domain}
• Review Process: Comprehensive technical evaluation
• Timeline: Results within one week

If you have any urgent questions about your application status, please don't hesitate to reach out to our HR team.

Thank you for your continued interest in our internship program. We appreciate the time and effort you put into your application.

Best regards,
The HR Team
Aarti Multi Services Pvt. Ltd.

---
This is an automated message. Please do not reply to this email.
For inquiries, contact: info@aartmultiservices.com"""

    return send_email(to_email, subject, body)


def send_in_training_email(to_email: str, student_name: str, domain: str) -> bool:
    """Send professional training start email"""
    subject = "🎓 Welcome to Training - Your Internship Journey Begins!"

    body = f"""Dear {student_name},

Congratulations! We are excited to inform you that your training phase has officially begun for the {domain} internship program.

Welcome to the Team:
You are now part of our internship program. Your dedication and skills have brought you to this milestone, and we look forward to supporting your professional growth.

Training Program Overview:
Our comprehensive program will provide you with skill development in {domain} through hands-on projects, real-world applications, and mentorship from experienced professionals. You'll also participate in regular progress assessments and feedback sessions.

What You'll Gain:
Industry-relevant technical skills, professional development, and soft skills. Upon successful completion, you'll receive a certificate and potential opportunities for full-time positions.

Important Information:
• Training Duration: As per program schedule
• Attendance: Regular participation is essential
• Resources: Training materials will be provided
• Support: Dedicated mentors and coordinators available

Next Steps:
Check your email for detailed training schedule, prepare any required materials, and join the orientation session. You'll also be connected with your assigned mentor.

Tips for Success:
Maintain consistent attendance, ask questions when needed, complete assignments on time, and network with fellow interns and team members.

We believe in your potential and are committed to helping you succeed in this program. This is an excellent opportunity to develop your skills and advance your career in {domain}.

Welcome aboard, and we look forward to your journey with us!

Best regards,
The HR Team
Aarti Multi Services Pvt. Ltd.

---
This is an automated message. Please do not reply to this email.
For training inquiries, contact: info@aartmultiservices.com"""

    return send_email(to_email, subject, body)


def send_completed_email(to_email: str, student_name: str, domain: str) -> bool:
    """Send professional completion email"""
    subject = "🏆 Congratulations! Training Program Completed Successfully"

    body = f"""Dear {student_name},

Congratulations! We are thrilled to inform you that you have successfully completed the {domain} internship training program.

Achievement Unlocked:
• You have demonstrated exceptional dedication and commitment
• Your skills and knowledge have grown significantly during this program
• You have successfully met all training requirements and objectives

What You've Accomplished:
• Completed comprehensive {domain} training curriculum
• Successfully finished all assigned projects and assessments
• Demonstrated proficiency in required technical skills
• Showed excellent professional development and growth

Certification & Recognition:
• Official completion certificate will be issued
• Your achievement will be added to our successful graduates list
• LinkedIn recommendation available upon request
• Portfolio of completed projects for your professional profile

Career Opportunities:
• You are now qualified for advanced positions in {domain}
• We may contact you for relevant job openings in our organization
• Your profile will be maintained in our talent database
• References and recommendations available for future applications

Next Steps:
• Completion certificate will be sent via email within 2-3 business days
• Update your LinkedIn profile with this achievement
• Consider applying for available positions in our company
• Stay connected with our alumni network

Continued Growth:
• Keep building on the skills you've developed
• Consider advanced certifications in your domain
• Stay updated with industry trends and technologies
• Maintain the professional network you've built

We hope you'll stay in touch and consider Aarti Multi Services for your future career endeavors. Your success is our success, and we take pride in your achievements.

Once again, congratulations on this significant milestone. We wish you all the best in your future career and look forward to hearing about your continued success.

Proud of your achievement,
The HR Team
Aarti Multi Services Pvt. Ltd.

---
This is an automated message. Please do not reply to this email.
For career opportunities, contact: info@aartmultiservices.com"""

    return send_email(to_email, subject, body)


def send_otp_email(to_email: str, student_name: str, otp_code: str) -> bool:
    """Send professional OTP verification email"""
    subject = "🔐 Password Reset Verification - Secure Access Code"

    body = f"""Dear {student_name},

We received a request to reset the password for your internship portal account.

🔑 Your Verification Code: {otp_code}

⏰ This code is valid for 10 minutes only.

⚠️ If you didn't request this reset, please ignore this email.

For security reasons, do not share this code with anyone.

Best regards,
The Security Team
Aarti Multi Services Pvt. Ltd.

---
This is an automated message. Please do not reply.
For support, contact: info@aartmultiservices.com"""

    return send_email(to_email, subject, body)


def send_applied_email(to_email: str, student_name: str, domain: str, application_id: str = "") -> bool:
    """Send professional application confirmation email"""
    subject = "📝 Application Received - Thank You for Applying"

    # If no application ID is provided, use a generic message
    app_id_text = f"#{application_id}" if application_id else "assigned upon review"
    
    body = f"""Dear {student_name},

Thank you for submitting your internship application for the {domain} domain at Aarti MultiServices PVT LTD. We have successfully received your application and wanted to confirm that it is now under review.

What Happens Next:
• Our team will carefully review your application
• Qualified candidates will be contacted for the next steps
• The review process typically takes 3-5 business days
• You will receive an update on your application status

Application Details:
• Position: Internship in {domain}
• Application ID: {app_id_text}
• Submission Date: {get_current_date()}
• Status: Under Review

During the Review Period:
• Please monitor your email for important updates
• Ensure your contact information is up to date
• Feel free to reach out if you have any questions

Why Apply with Us:
• Gain hands-on experience in your field
• Work on real projects with industry professionals
• Build your professional network
• Enhance your resume with valuable experience

We appreciate the time and effort you put into your application. Our team is excited to learn more about you and your potential contributions to our organization.

Thank you again for your interest in our internship program. We look forward to reviewing your qualifications and potentially welcoming you to our team.

Best regards,
The HR Team
Aarti Multi Services Pvt. Ltd.
---
This is an automated message. Please do not reply to this email.
For inquiries, contact: info@aartmultiservices.com"""

    return send_email(to_email, subject, body)


def get_current_date():
    """Helper function to get current date in a formatted string"""
    from datetime import datetime
    return datetime.now().strftime("%B %d, %Y")

