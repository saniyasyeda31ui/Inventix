-- 1. Add 'settings' JSONB column to public.companies
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS settings JSONB NOT NULL DEFAULT '{
  "company": {
    "industry": "Manufacturing",
    "timezone": "UTC",
    "currency": "USD",
    "dateFormat": "MM/DD/YYYY"
  },
  "procurement": {
    "approvalLimit": 10000,
    "autoApproveThreshold": 500,
    "defaultLeadTime": 14
  },
  "inventory": {
    "lowStockThreshold": 50,
    "autoReorder": false,
    "valuationMethod": "FIFO"
  },
  "notifications": {
    "emailEnabled": true,
    "purchaseAlerts": true,
    "inventoryAlerts": true,
    "paymentReminders": false
  },
  "security": {
    "twoFactor": false,
    "sessionTimeout": 60
  },
  "users": {
    "defaultRole": "viewer"
  },
  "system": {
    "language": "en",
    "theme": "light"
  }
}'::jsonb;

-- 2. Ensure RLS policies are correct for companies
-- Since there is no company_id yet, and we match on profile.organization = companies.name
-- we can create a policy that allows an admin to update the company if their profile's organization matches the company name.

-- Drop the old update policy
DROP POLICY IF EXISTS "companies: managers can update" ON public.companies;

-- Create the new strict update policy: only admins whose organization matches the company name can update
CREATE POLICY "companies: admins can update own company"
  ON public.companies FOR UPDATE TO authenticated
  USING (
    public.is_manager() AND 
    name = (SELECT organization FROM public.profiles WHERE id = auth.uid())
  );
