# CRUD Implementation Workflow

Before implementing any CRUD for a module, the following workflow MUST be followed strictly.

## PHASE 1 – Database Audit (Mandatory)
Before writing any code:
1. Inspect the table schema. Determine:
   - column names
   - data types
   - nullable columns
   - default values
   - primary key
   - whether id is UUID or TEXT
   - whether another column (code, sku, etc.) is the business identifier.
2. Inspect all RLS policies. Verify the table has SELECT, INSERT, UPDATE, and DELETE.
   If any policy is missing, report it before implementing CRUD.
   Do NOT assume policies exist.

## PHASE 2 – Frontend Mapping
Before coding, map every frontend field to the exact database column.
Never assume naming conventions.

## PHASE 3 – CRUD Implementation
Implement: Create, Read, Update, Delete.
Requirements:
- optimistic UI
- rollback on failure
- proper toast messages
- refresh on rollback
- zero duplicated CRUD logic
Do not create duplicate Add/Edit modals. Overview Quick Actions must reuse the module CRUD.

## PHASE 4 – Diagnostics
Before considering the feature complete, temporarily log:
- CREATE: payload, Supabase response, error, inserted row
- UPDATE: payload, response, error
- DELETE: identifier, response, status, error, affected rows
Remove logs after verification.

## PHASE 5 – Manual Verification
Verify:
- Create updates Supabase
- Edit updates Supabase
- Delete removes from Supabase
- Refresh keeps data consistent
- Overview Quick Action works
- No console errors
- npm run build passes

**IMPORTANT:** Never assume UUID, TEXT id, code column, RLS policies, or foreign keys. Always inspect first. If a database issue is found, explain the exact root cause before changing code. Only after the audit is complete should implementation begin.
