# Module Requirements: AI Insights

## 1. Business Requirements
The AI Insights module provides predictive analytics, forecasting demand surges, identifying stock risks, and optimizing supplier pricing.
- Minimize stockouts by automating safety margin adjustments.
- Highlight alternative sourcing pathways to lower procurement spend.

## 2. User Stories
- **As an Alexander S.,** I want to review automated safety-stock suggestions so that I can avoid pipeline delays.
- **As a Sourcing Manager,** I want to view price comparisons for alternative vendors to optimize contract values.

## 3. Validations
- **Accuracy Scores:** Real-time feedback ratings must be computed and verified.
- **Trigger Bounds:** Inventory levels must trigger model runs when crossing threshold parameters.

## 4. Edge Cases
- **Commodity Volatility:** Sudden shifts in regional price indices must trigger automatic model evaluations and update active advice cards.
- **Extended Inactivity:** If server APIs fail to return data, provide cached recommendations with clear system alerts.

## 5. Database Entities (PostgreSQL / Supabase Schema)
```sql
create table public.ai_recommendations (
  id uuid primary key default gen_random_uuid(),
  item text not null,
  severity text not null default 'medium', -- 'low', 'medium', 'high'
  alert_message text not null,
  suggested_qty integer not null,
  alternative_supplier text,
  estimated_savings numeric(12,2),
  status text not null default 'Active', -- 'Active', 'Executed', 'Dismissed'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

## 6. API Requirements
- `GET /api/ai/recommendations` (Retrieves active alerts).
- `POST /api/ai/recalculate` (Refreshes machine learning models).

## 7. UI Dependencies
- High-contrast alert boxes highlighting prioritized items (High, Medium, Low).
- Animated SVG curves mapping future material demand waves.

## 8. Acceptance Criteria
1. Executing recommendations triggers automated purchase requests.
2. Model calculations trigger smooth, full-card skeleton shimmers.
3. Recalculation toast notifications run for at least 4 seconds.
