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


def send_in_review_email(to_email: str, student_name: str, domain: str) -> bool:
    """Send professional in review email"""
    subject = "🔍 Application Update - Under Review"

    body = f"""Dear {student_name},

We hope this message finds you well. We wanted to provide you with an important update regarding your internship application for the {domain} domain.

🎯 Current Status:
• Your application is now under review by our technical team
• Our experts are carefully evaluating your qualifications and skills
• This is a positive step in our selection process

📋 What's Happening Now:
• Technical assessment of your resume and portfolio
• Evaluation of your domain-specific knowledge and experience
• Comparison with program requirements and expectations
• Review timeline: 3-5 business days

🕐 What to Expect Next:
• You will receive a notification once the review is complete
• Successful candidates will be contacted for the next stage
• We appreciate your patience during this evaluation period

💼 Program Information:
• Domain: {domain}
• Review Process: Comprehensive technical evaluation
• Timeline: Results within one week

📞 Questions or Concerns:
If you have any urgent questions about your application status, please don't hesitate to reach out to our HR team.

Thank you for your continued interest in our internship program. We appreciate the time and effort you put into your application.

Best regards,
The HR Team
Aarti MultiServices PVT LTD

---
This is an automated message. Please do not reply to this email.
For inquiries, contact: hr@yourcompany.com"""

    return send_email(to_email, subject, body)


def send_in_training_email(to_email: str, student_name: str, domain: str) -> bool:
    """Send professional training start email"""
    subject = "🎓 Welcome to Training - Your Internship Journey Begins!"

    body = f"""Dear {student_name},

Congratulations! We are excited to inform you that your training phase has officially begun for the {domain} internship program.

🎉 Welcome to the Team:
• You are now part of our internship program
• Your dedication and skills have brought you to this milestone
• We look forward to supporting your professional growth

📚 Training Program Overview:
• Comprehensive skill development in {domain}
• Hands-on projects and real-world applications
• Mentorship from experienced professionals
• Regular progress assessments and feedback sessions

🎯 What You'll Gain:
• Industry-relevant technical skills
• Professional development and soft skills
• Certificate of completion upon successful training
• Potential opportunities for full-time positions

📋 Important Information:
• Training Duration: As per program schedule
• Attendance: Regular participation is essential
• Resources: Training materials will be provided
• Support: Dedicated mentors and coordinators available

📅 Next Steps:
• Check your email for detailed training schedule
• Prepare any required materials or setup
• Join orientation session (details to follow)
• Connect with your assigned mentor

💡 Tips for Success:
• Maintain consistent attendance and participation
• Ask questions and seek clarification when needed
• Complete all assignments and projects on time
• Network with fellow interns and team members

We believe in your potential and are committed to helping you succeed in this program. This is an excellent opportunity to develop your skills and advance your career in {domain}.

Welcome aboard, and we look forward to your journey with us!

Best regards,
The Training Team
Aarti MultiServices PVT LTD

---
This is an automated message. Please do not reply to this email.
For training inquiries, contact: training@yourcompany.com"""

    return send_email(to_email, subject, body)


def send_completed_email(to_email: str, student_name: str, domain: str) -> bool:
    """Send professional completion email"""
    subject = "🏆 Congratulations! Training Program Completed Successfully"

    body = f"""Dear {student_name},

Congratulations! We are thrilled to inform you that you have successfully completed the {domain} internship training program.

🎉 Achievement Unlocked:
• You have demonstrated exceptional dedication and commitment
• Your skills and knowledge have grown significantly during this program
• You have successfully met all training requirements and objectives

🏆 What You've Accomplished:
• Completed comprehensive {domain} training curriculum
• Successfully finished all assigned projects and assessments
• Demonstrated proficiency in required technical skills
• Showed excellent professional development and growth

📜 Certification & Recognition:
• Official completion certificate will be issued
• Your achievement will be added to our successful graduates list
• LinkedIn recommendation available upon request
• Portfolio of completed projects for your professional profile

💼 Career Opportunities:
• You are now qualified for advanced positions in {domain}
• We may contact you for relevant job openings in our organization
• Your profile will be maintained in our talent database
• References and recommendations available for future applications

🌟 Next Steps:
• Completion certificate will be sent via email within 2-3 business days
• Update your LinkedIn profile with this achievement
• Consider applying for available positions in our company
• Stay connected with our alumni network

📈 Continued Growth:
• Keep building on the skills you've developed
• Consider advanced certifications in your domain
• Stay updated with industry trends and technologies
• Maintain the professional network you've built

🤝 Stay Connected:
We hope you'll stay in touch and consider Aarti MultiServices for your future career endeavors. Your success is our success, and we take pride in your achievements.

Once again, congratulations on this significant milestone. We wish you all the best in your future career and look forward to hearing about your continued success.

Proud of your achievement,
The HR Team
Aarti MultiServices PVT LTD

---
This is an automated message. Please do not reply to this email.
For career opportunities, contact: careers@yourcompany.com"""

    return send_email(to_email, subject, body)


def send_otp_email(to_email: str, student_name: str, otp_code: str) -> bool:
    """Send professional OTP verification email"""
    subject = "🔐 Password Reset Verification - Secure Access Code"

    body = f"""Dear {student_name},

We received a request to reset the password for your internship portal account associated with this email address.

🔑 Your Verification Code:

    {otp_code}

⏰ Important Security Information:
• This code is valid for 10 minutes only
• Use this code to verify your identity and proceed with password reset
• For your security, do not share this code with anyone
• If you didn't request this reset, please ignore this email

🛡️ Security Guidelines:
• Only enter this code on our official website
• Our team will never ask for your OTP via phone or email
• Always ensure you're on our secure website before entering codes
• Contact support immediately if you suspect unauthorized access

📱 How to Use This Code:
1. Return to the password reset page
2. Enter the 6-digit code exactly as shown above
3. Complete the password reset process
4. Choose a strong, unique password

⚠️ Didn't Request This?
If you didn't request a password reset, please:
• Ignore this email - no action is required
• Consider changing your password as a precaution
• Contact our support team if you have security concerns

🔄 Need a New Code?
If your code has expired, you can request a new one from the password reset page. For security reasons, each code can only be used once.

📞 Need Help?
If you're having trouble with the password reset process or have any security concerns, please contact our support team immediately.

Thank you for helping us keep your account secure.

Best regards,
The Security Team
Aarti MultiServices PVT LTD

---
This is an automated security message. Please do not reply to this email.
For technical support, contact: support@yourcompany.com"""

    return send_email(to_email, subject, body)
