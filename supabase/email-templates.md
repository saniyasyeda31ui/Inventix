# Inventix Enterprise Email Templates

To fully brand the Enterprise Onboarding flow, you must configure Supabase to use the custom HTML invitation template below.

## Prerequisites for Custom Email Templates

Supabase enforces strict rules regarding custom email templates:
- You **cannot** customize email templates while using the default free Supabase email service (it only allows very minor text changes to prevent spam abuse).
- To enable custom HTML templates (like the one below), you must either:
  1. Upgrade to a **Supabase Pro** plan, OR
  2. Configure a **Custom SMTP Server** (e.g., SendGrid, AWS SES, Postmark) in your Supabase Auth settings.

## Authentication Configuration

Before using this template, ensure your Supabase Auth settings are configured correctly:

- **Site URL**: `http://localhost:3000` (Update to your production domain when deploying).
- **Redirect URL**: Add `http://localhost:3000/accept-invitation` to the allowed Redirect URLs.

## Invitation Email Template

Paste the following HTML code into the **"Invite User"** template field in your Supabase Auth Dashboard. 
Notice that we do not mention Supabase anywhere, and we leverage the custom metadata `{{ .Data.full_name }}`, `{{ .Data.role }}`, and `{{ .Data.department }}` injected by our edge function.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #030712;
      color: #f8fafc;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 12px;
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #4f46e5 0%, #312e81 100%);
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 24px;
      letter-spacing: 1px;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
      color: #ffffff;
    }
    .body-text {
      font-size: 15px;
      line-height: 1.6;
      color: #cbd5e1;
      margin-bottom: 30px;
    }
    .info-box {
      background-color: #020617;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 30px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .info-row:last-child {
      margin-bottom: 0;
    }
    .info-label {
      color: #64748b;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .info-value {
      color: #f8fafc;
      font-weight: 500;
      font-size: 14px;
      text-transform: capitalize;
    }
    .button-container {
      text-align: center;
      margin-top: 40px;
    }
    .button {
      display: inline-block;
      background-color: #4f46e5;
      color: #ffffff;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      transition: background-color 0.2s;
    }
    .button:hover {
      background-color: #4338ca;
    }
    .footer {
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #64748b;
      border-top: 1px solid #1e293b;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>INVENTIX ENTERPRISE</h1>
    </div>
    <div class="content">
      <div class="greeting">Hello {{ .Data.full_name }},</div>
      <div class="body-text">
        You have been invited by your administrator to access the Inventix Enterprise Procurement & Inventory Management Platform.
      </div>
      
      <div class="info-box">
        <div class="info-row">
          <span class="info-label">Role:</span>
          <span class="info-value">{{ .Data.role }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Department:</span>
          <span class="info-value">{{ .Data.department }}</span>
        </div>
      </div>

      <div class="body-text" style="text-align: center;">
        Please click the button below to activate your account and create your password.
      </div>

      <div class="button-container">
        <!-- 
          The {{ .ConfirmationURL }} will automatically append the invite token
          and redirect to the Redirect URL (http://localhost:3000/accept-invitation).
        -->
        <a href="{{ .ConfirmationURL }}" class="button">Activate My Account</a>
      </div>
    </div>
    <div class="footer">
      If you were not expecting this invitation, you can safely ignore this email.
    </div>
  </div>
</body>
</html>
```
