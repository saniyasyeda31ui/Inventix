# Deployment Guide

This document outlines the steps required to provision the backend infrastructure, configure the application environment, and deploy Inventix ERP to a production hosting provider.

## 1. Prerequisites
- Node.js (v18+)
- NPM or Yarn
- A Supabase Account (for PostgreSQL, Auth, and Edge Functions)
- A Vercel, Netlify, or AWS Amplify account (for Frontend hosting)

## 2. Supabase Backend Setup

### A. Project Creation
1. Log in to [Supabase](https://supabase.com/) and create a new Project.
2. Store the **Project URL** and **anon public key**; you will need these for the frontend `.env.local` file.

### B. Database Migration (Schema Initialization)
The database schema must be applied precisely to ensure Row-Level Security policies are engaged before any data flows.

1. Navigate to the **SQL Editor** in the Supabase Dashboard.
2. Open `supabase/migrations/20260630000000_init_schema.sql` from the repository.
3. Paste the entire content into the SQL Editor and click **Run**.
4. Open `supabase/migrations/20260705000000_update_profile_roles.sql`, paste, and **Run**.
5. *Verification:* Ensure all 15 tables are created and RLS is marked as 'Active' on all of them in the Table Editor.

### C. Authentication Configuration
1. In Supabase, navigate to **Authentication -> Providers**.
2. Enable **Email** authentication. 
3. *Optional:* Disable "Confirm email" during initial local development testing.

## 3. Local Development

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the application at `http://localhost:3000`.

## 4. Production Frontend Deployment (e.g., Vercel)

Inventix ERP is a standard Vite-based React Single Page Application (SPA). It can be easily deployed to Vercel.

1. Push your repository to GitHub.
2. Log in to Vercel and **Add New Project**.
3. Import the Inventix repository.
4. **Framework Preset:** Vite will be automatically detected.
5. **Build Command:** `npm run build`
6. **Output Directory:** `dist`
7. **Environment Variables:** Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the Vercel project settings.
8. Click **Deploy**.

## 5. Post-Deployment Steps
- **Seed Initial Admin:** Once deployed, register the first user account through the `/register-company` route.
- **Manual Role Escalation:** Because of RLS, the first user defaults to `viewer`. You must manually access the Supabase Table Editor for `public.profiles`, locate the newly created user, and change their role to `admin` or `manager` to unlock the rest of the application.
- **Edge Functions:** (Pending) Deploy any required AI recommendation Deno scripts to Supabase Edge Functions using the Supabase CLI:
  ```bash
  supabase functions deploy ai_recommendations
  ```
