# Project Context

## Executive Summary & Product Vision
**Inventix ERP** is a high-fidelity, high-density enterprise resource planning (ERP) dashboard built for lead sourcing administrators, procurement managers, and logistics specialists. Designed with a sleek, distraction-free "Midnight Slate" dark aesthetic, it balances complex data operations with premium micro-interactions. 

The application is in transition from a rich frontend prototype to a robust, secure, cloud-hosted platform backed by **Supabase** (PostgreSQL). It is designed to support real-time data flow, role-based access control, and intuitive data visualizations.

## Product Architecture & Technical Stack

### Frontend
- **Framework:** React 19, Vite.
- **Language:** TypeScript.
- **Styling:** Tailwind CSS (v4.x) utilizing a specialized "Midnight Slate" dark enterprise theme.
- **Animations:** `motion` library for fluid, physics-based micro-interactions.
- **Icons:** `lucide-react` for scalable SVG icon sets.
- **Data Visualization:** Custom inline interactive SVGs to ensure high performance with zero external charting bloat.

### Backend & Cloud Infrastructure (Supabase)
- **Database:** PostgreSQL with strict Row-Level Security (RLS).
- **Authentication:** Supabase Auth (JWT, email logins, profile integration).
- **Real-Time Data:** Supabase Realtime for notifications, inventory updates, and activity tracking.
- **Edge Functions:** Deno-based Supabase Edge Functions for handling AI recommendations and asynchronous tasks (pending full integration).

## Folder Structure

```
Inventix/
├── .agents/                 # AI assistant customized configurations and skills
├── docs/                    # Complete technical documentation (You are here)
├── src/
│   ├── components/          # Reusable UI components (Tables, layout sections, skeletons)
│   ├── context/             # Global React Contexts (e.g., AuthContext)
│   ├── data/                # Mock data / Initial dataset seeding tools
│   ├── hooks/               # Custom React hooks wrapping Supabase queries (e.g., useProducts)
│   ├── lib/                 # Core utilities (e.g., rbac.ts, supabase.ts client)
│   ├── pages/               # Top-level route components (Dashboard, Login, Landing)
│   ├── utils/               # General helper functions (e.g., formatting, date manipulation)
│   ├── App.tsx              # Application Routing Layer
│   └── main.tsx             # Application Entry Point
├── supabase/
│   ├── functions/           # Supabase Edge Functions
│   └── migrations/          # PostgreSQL schema and RLS definition scripts
├── package.json             # NPM scripts and dependencies
├── vite.config.ts           # Vite bundler configuration
└── tailwind.css / index.css # Global CSS, fonts, and base Tailwind directives
```

## Application Flow
1. **Public Routes:** Landing page, Login, Register Company, Forgot Password.
2. **Auth Guard:** Protected routes via `RouteGuard.tsx` ensuring users have a valid session before accessing the dashboard.
3. **Dashboard Modules:** The central `DashboardPage.tsx` orchestrates multiple interconnected modules (Products, Inventory, Warehouses, Purchase Orders, etc.) through a tab-based navigation system.

## Known Issues & Limitations
- The system is currently in migration to full Supabase backend support. Some components may still rely on mock data fallbacks in `src/data` during local development if the database is not fully seeded.
- Hardcoded AI predictive visualizations in the frontend need active bridging to backend Edge Functions.
- Deep historical auditing for individual table fields is limited to what `activity_logs` captures.

## Pending Work
- **Complete Supabase Hook Integration:** Ensure all CRUD operations explicitly trigger optimistic UI updates across all custom hooks.
- **Edge Function Scheduling:** Implement pg_cron or similar periodic triggers to run AI predictive stockout calculations hourly.
- **Comprehensive Testing:** Add end-to-end tests for critical authentication and procurement flows.
