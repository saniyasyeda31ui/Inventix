# Module Requirements: Company

## 1. Business Requirements
The Company module manages the primary organizational identities, global business addresses, operational entities, fiscal years, and localized currency configuration mapping.
- Standardize structural entity parameters for multi-subsidiary procurement networks.
- Manage fiscal calendars and primary reporting currencies.

## 2. User Stories
- **As a Sourcing Administrator,** I want to update our primary shipping addresses so that all printed purchase order PDFs reference the correct delivery docks automatically.
- **As a Financial Auditor,** I want to set the default reporting currency to USD/INR so that stock valuation statistics calculate accurately on the dashboard metrics.

## 3. Validations
- **Tax Identifier / VAT Number:** Must align with target country formats (e.g., GST numbers matching India layouts, VAT matching EU structures).
- **Fiscal Start Date:** Must correspond to standard calendar monthly boundaries.

## 4. Edge Cases
- **Multi-entity Overlap:** Prevent users from overwriting sibling corporate subsidiaries by enforcing strict isolation locks on subsidiary profiles.
- **Active Reporting Adjustments:** If corporate currency shifts mid-year, recalculate all existing ledger valuation metrics on-the-fly or preserve historic rates.

## 5. Database Entities (PostgreSQL / Supabase Schema)
```sql
create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tax_identifier text not null unique,
  address_line_1 text not null,
  address_line_2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null,
  reporting_currency text not null default 'USD',
  fiscal_year_start date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

## 6. API Requirements
- `GET /api/company/details` (Retrieves general company profiles).
- `PUT /api/company/update` (Updates contact coordinates, tax identifiers, or shipping metrics).

## 7. UI Dependencies
- Elegant profile forms containing dropdown selections for currencies and countries.
- Toast alerts acknowledging "Company parameters successfully updated."

## 8. Acceptance Criteria
1. Tax identifier validations trigger feedback if invalid alphanumeric characters are submitted.
2. Forms populate instantly with pre-cached context.
3. Access restricted to authorized managers and organizational owners.
