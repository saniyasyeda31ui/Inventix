# Module Requirements: Notifications

## 1. Business Requirements
The Notifications module delivers real-time workspace updates to personnel, tracking stockout alerts, pending approvals, and payment deadlines.
- Keep procurement specialists and logistics personnel aligned instantly.
- Highlight critical system events with sliding sidebar drawers.

## 2. User Stories
- **As an Alexander S.,** I want to receive an alert when a critical part hits low stock so that I can reorder it.
- **As a Logistics Specialist,** I want to mark individual notifications as read to declutter my workspace feed.

## 3. Validations
- **State Changes:** Marking items as read must update individual database rows dynamically.
- **Content Formatting:** Message descriptors must be concise and easily readable.

## 4. Edge Cases
- **Alert Ingress Flooding:** Consolidate repeating alerts (e.g., duplicate safety triggers) into a single notification thread to prevent notification fatigue.
- **Broadcasting Failures:** If real-time sockets disconnect, queue alerts locally and push updates immediately upon reconnection.

## 5. Database Entities (PostgreSQL / Supabase Schema)
```sql
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  read boolean not null default false,
  time_label text not null,
  user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

## 6. API Requirements
- `GET /api/notifications` (Retrieves active alerts and filters unread items).
- `PATCH /api/notifications/:id/read` (Updates read flags).
- `POST /api/notifications/mark-all` (Updates all unread notifications to read).

## 7. UI Dependencies
- Slides-out panel drawer with smooth spring entry animations.
- Custom pulsing red warning indicator bells in the header bar.

## 8. Acceptance Criteria
1. Mark All read triggers success notifications instantly.
2. Clicking a notification redirects to the corresponding source page.
3. Unread badges update calculations accurately across active tabs.
