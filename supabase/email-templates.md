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
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
      background-color: #f9fafb;
      color: #111827;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    table.wrapper {
      width: 100%;
      background-color: #f9fafb;
      padding: 40px 0;
    }
    .container {
      max-width: 520px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
    }
    .header {
      padding: 48px 40px 0;
      text-align: center;
    }
    .company-logo {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      background-color: #f3f4f6;
      color: #374151;
      border-radius: 14px;
      margin-bottom: 24px;
    }
    .company-name {
      margin: 0;
      color: #111827;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.02em;
      line-height: 1.3;
    }
    .content {
      padding: 32px 40px 48px;
    }
    .greeting {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 16px;
      color: #111827;
    }
    .body-text {
      font-size: 15px;
      line-height: 1.6;
      color: #4b5563;
      margin-bottom: 32px;
    }
    .info-box {
      background-color: #f9fafb;
      border: 1px solid #f3f4f6;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 32px;
    }
    .info-row {
      margin-bottom: 16px;
    }
    .info-row:last-child {
      margin-bottom: 0;
    }
    .info-label {
      display: block;
      color: #6b7280;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .info-value {
      display: block;
      color: #111827;
      font-weight: 500;
      font-size: 15px;
    }
    .button-container {
      text-align: center;
    }
    .button {
      display: inline-block;
      background-color: #111827;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 15px;
      transition: background-color 0.2s;
    }
    .button:hover {
      background-color: #374151;
    }
    .footer {
      text-align: center;
      padding: 32px 40px;
      background-color: #ffffff;
      border-top: 1px solid #f3f4f6;
    }
    .footer-text {
      font-size: 13px;
      color: #9ca3af;
      margin-bottom: 16px;
      line-height: 1.5;
    }
    .powered-by {
      font-size: 12px;
      color: #d1d5db;
      font-weight: 500;
      letter-spacing: 0.02em;
    }
    .inventix-brand {
      color: #8b5cf6;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center">
        <div class="container">
          <div class="header">
            <div class="company-logo">
              <!-- Building Icon SVG -->
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 21h18"></path>
                <path d="M9 8h1"></path>
                <path d="M9 12h1"></path>
                <path d="M9 16h1"></path>
                <path d="M14 8h1"></path>
                <path d="M14 12h1"></path>
                <path d="M14 16h1"></path>
                <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path>
              </svg>
            </div>
            <h1 class="company-name">{{ .Data.organization }}</h1>
          </div>
          <div class="content">
            <div class="greeting">Welcome, {{ .Data.full_name }}</div>
            <div class="body-text">
              You have been invited to join <strong>{{ .Data.organization }}</strong>. Please set up your account to access your enterprise workspace and tools.
            </div>
            
            <div class="info-box">
              <div class="info-row">
                <span class="info-label">Joining Company</span>
                <span class="info-value">{{ .Data.organization }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Assigned Role</span>
                <span class="info-value">{{ .Data.role }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email Address</span>
                <span class="info-value">{{ .Email }}</span>
              </div>
            </div>

            <div class="button-container">
              <a href="{{ .ConfirmationURL }}" class="button">Create Password</a>
            </div>
          </div>
          <div class="footer">
            <div class="footer-text">
              This invitation was sent to {{ .Email }}.<br>If you were not expecting this, you can safely ignore it.
            </div>
            <div class="powered-by">
              Powered by <span class="inventix-brand">Inventix ERP</span>
            </div>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
```

