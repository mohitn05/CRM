def send_notification(email: str, phone: str, name: str, status: str) -> bool:
    print(f"[Notification] {name} updated to {status}")
    print(f"Email: {email} | Phone: {phone}")
    # TODO: Integrate actual email/SMS sending logic
    return True
