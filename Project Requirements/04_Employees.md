# Module Requirements: Employees

## 1. Business Requirements
The Employees module handles personnel directories, department alignment, active organizational emails, role tiers, and direct-line manager relationships.
- Control user enrollment and coordinate directory rosters.
- Track department assignments for accurate purchase request routing.

## 2. User Stories
- **As a Manager,** I want to enroll a new Procurement Specialist so that they can begin drafting local purchase requests immediately.
- **As an Alexander S.,** I want to verify the department of a requestor to check their purchase order authorization limits.

## 3. Validations
- **Work Email:** Must verify domains match the primary corporate organization suffix (e.g., `@company.com`).
- **Required Fields:** Name, email, department, and direct-manager keys must not be blank.

## 4. Edge Cases
- **Cyclic Managers:** A recursive query check must prevent an employee from being assigned as their own manager or generating cyclic relationship loops.
- **Terminated Ingress:** De-authorizing an employee must lock all corresponding API tokens instantly, archiving their profile record while retaining historic log signatures.

## 5. Database Entities (PostgreSQL / Supabase Schema)
```sql
create table public.employees (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  full_name text not null,
  work_email text not null unique,
  department text not null, -- 'Sourcing', 'Logistics', 'Finance'
  title text not null,
  manager_id uuid references public.employees(id),
  status text not null default 'Active', -- 'Active', 'Suspended', 'Archived'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

## 6. API Requirements
- `GET /api/employees` (Retrieves directory list with department filters).
- `POST /api/employees` (Enrolls profile and issues invitations).
- `DELETE /api/employees/:id` (Suspends access permissions).

## 7. UI Dependencies
- Compact card grid structures displaying employee directories.
- Dynamic supervisor dropdown selector lists.

## 8. Acceptance Criteria
1. Employee validation halts form submission if email is duplicate.
2. Successfully maps direct reporting hierarchies.
3. RLS prevents non-managers from editing employee status entries.
