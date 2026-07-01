# Module Requirements: Authentication

## 1. Business Requirements
Secure user access control is fundamental to Inventix ERP. The Authentication module provides identity verification, secure session management, password hashing, and token handling.
- Only authorized organizational users can access internal dashboards.
- Sessions must be tracked with secure JWTs to prevent spoofing and identity theft.
- Support password recovery workflows and multi-factor authentication setup interfaces.

## 2. User Stories
- **As a Sourcing Administrator,** I want to sign in with my enterprise email and password so that I can access my workspace securely.
- **As a Logistics Coordinator,** I want to be redirected to the sign-in page if my session expires, preventing unauthorized eyes from viewing stock locations.
- **As any user,** I want to reset my password via an email validation link if I forget it.

## 3. Validations
- **Email:** Must conform to RFC 5322 standard formats (e.g., `user@company.com`).
- **Password Complexity:** Minimum 8 characters, containing at least one uppercase letter, one lowercase letter, one numeric digit, and one special character (e.g., `@`, `$`, `!`, `%`, `*`, `?`, `&`).
- **Session Duration:** Idle logout triggered after 30 minutes of inactivity.

## 4. Edge Cases
- **Simultaneous Logins:** System must allow admins to restrict sessions to a single active device or handle multiple sessions with distinct token invalidation hashes.
- **Brute Force Ingress:** Account locking for 15 minutes after 5 failed login attempts within 5 minutes.
- **Iframed Context:** Authentication cookies must utilize `SameSite=None; Secure` flags to run correctly inside standard platform previews without dropping authorization headers.

## 5. Database Entities (PostgreSQL / Supabase Schema)
```sql
-- Managed primarily via Supabase auth schema
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text not null,
  full_name text not null,
  role text not null default 'viewer',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

## 6. API Requirements
- `POST /api/auth/login` (Body: `{ email, password }` -> Returns dynamic JWT token).
- `POST /api/auth/logout` (Invalidates dynamic session token).
- `POST /api/auth/reset-password` (Sends reset link).

## 7. UI Dependencies
- Login component screen with password visibility toggler.
- Toast system notifications triggering "Logged in successfully" or "Incorrect email or password".
- Fullscreen loading spinner or skeleton loaders for profile verification logic on startup.

## 8. Acceptance Criteria
1. Redirect unauthenticated users to `/login` if trying to access `/dashboard`.
2. Block login button with inline loading spinners during API operations.
3. Successfully clear authentication tokens and local states on Sign Out.
