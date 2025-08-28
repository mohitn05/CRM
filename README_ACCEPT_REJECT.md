# Admin Accept/Reject Functionality

This document describes the new accept/reject functionality for admin users in the CRM system.

## Overview

Admin users can now accept or reject student internship applications with professional email notifications sent automatically to applicants.

## Features

### ✅ Accept Application
- Updates application status to "Selected"
- Sends professional acceptance email with:
  - Congratulations message
  - Next steps information
  - Program details
  - Contact information
- Creates in-app notification
- Sends SMS notification (if configured)

### ❌ Reject Application
- Updates application status to "Rejected"
- Sends professional rejection email with:
  - Thank you message
  - Constructive feedback
  - Growth opportunities
  - Future application encouragement
- Creates in-app notification
- Sends SMS notification (if configured)

## Email Templates

### Acceptance Email
- **Subject**: 🎉 Congratulations! Your Internship Application Has Been Accepted
- **Content**: Professional acceptance letter with next steps, program details, and contact information
- **Tone**: Positive, encouraging, and informative

### Rejection Email
- **Subject**: Application Update - Internship Program
- **Content**: Professional rejection letter with constructive feedback and growth opportunities
- **Tone**: Respectful, encouraging, and professional

## Backend Implementation

### New API Endpoints

#### Accept Application
```
POST /api/students/{student_id}/accept
```
- Updates status to "Selected"
- Sends acceptance email
- Creates notification
- Returns success/error response

#### Reject Application
```
POST /api/students/{student_id}/reject
```
- Updates status to "Rejected"
- Sends rejection email
- Creates notification
- Returns success/error response

### Email Service
- **File**: `backend/app/services/email_sender.py`
- **Functions**:
  - `send_acceptance_email()` - Sends acceptance emails
  - `send_rejection_email()` - Sends rejection emails
  - `send_email()` - Generic email sender

### Admin Routes
- **File**: `backend/app/routes/admin.py`
- **Functions**:
  - `accept_student()` - Handles acceptance logic
  - `reject_student()` - Handles rejection logic

## Frontend Implementation

### Admin Student Detail Page
- **File**: `app/admin/student/[id]/page.tsx`
- **Features**:
  - Accept & Notify button
  - Reject & Notify button
  - Real-time status updates
  - Success/error notifications

### Admin Students List
- **File**: `app/admin/students/page.tsx`
- **Features**:
  - Accept/Reject buttons for each application
  - Bulk status management
  - Real-time updates

### Admin Dashboard
- **File**: `app/admin/dashboard/page.tsx`
- **Features**:
  - Quick accept/reject actions
  - Recent applications management
  - Status tracking

## Configuration

### Email Settings
The system uses Gmail SMTP for sending emails. Configure in `backend/config.py`:

```python
MAIL_SERVER = 'smtp.gmail.com'
MAIL_PORT = 587
MAIL_USE_TLS = True
MAIL_USERNAME = 'your-email@gmail.com'
MAIL_PASSWORD = 'your-app-password'
```

### Environment Variables
Create a `.env` file in the backend directory:

```env
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
```

## Usage

### For Admin Users

1. **Navigate to Applications**
   - Go to Admin Dashboard
   - Click on "Students" or "View Applications"

2. **Accept Application**
   - Click "✓ Accept" button
   - System automatically:
     - Updates status to "Selected"
     - Sends acceptance email
     - Creates notification
     - Shows success message

3. **Reject Application**
   - Click "✗ Reject" button
   - System automatically:
     - Updates status to "Rejected"
     - Sends rejection email
     - Creates notification
     - Shows success message

### For Students

1. **Email Notifications**
   - Receive professional acceptance/rejection emails
   - Check spam folder if emails don't appear
   - Follow next steps in acceptance emails

2. **In-App Notifications**
   - View status updates in the application
   - Check notification center for updates

## Testing

### Test Email Functionality
Run the test script to verify email sending:

```bash
cd backend
python test_email.py
```

### Test API Endpoints
Use tools like Postman or curl to test the new endpoints:

```bash
# Accept application
curl -X POST http://localhost:5000/api/students/1/accept

# Reject application
curl -X POST http://localhost:5000/api/students/1/reject
```

## Troubleshooting

### Email Not Sending
1. Check Gmail credentials in config
2. Verify Gmail App Password is correct
3. Check firewall/network settings
4. Review server logs for errors

### Status Not Updating
1. Check database connection
2. Verify API endpoint is accessible
3. Check frontend console for errors
4. Review backend logs

### Frontend Issues
1. Clear browser cache
2. Check browser console for errors
3. Verify API endpoints are correct
4. Check network connectivity

## Security Considerations

- Admin authentication required for all actions
- Email addresses validated before sending
- Rate limiting on email sending
- Logging of all accept/reject actions
- Audit trail maintained in database

## Future Enhancements

- Email templates customization
- Bulk accept/reject operations
- Email scheduling options
- Advanced notification preferences
- Integration with external email services
