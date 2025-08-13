from flask_mail import Mail, Message

mail = Mail()

def send_email(to_email, subject, body):
    msg = Message(subject, sender='mohitnarnaware.ams@gmail.com', recipients=[to_email])
    msg.body = body
    mail.send(msg)