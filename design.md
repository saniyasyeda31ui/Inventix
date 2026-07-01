# UI/UX Design System Specification
## Project: Inventix ERP Dashboard ("Midnight Slate" Theme)
**Author:** Lead UI/UX Systems Architect  
**Status:** Approved / Release Reference  
**Date:** June 30, 2026

---

## 1. Design Philosophy & Aesthetic Model

Inventix ERP implements a high-density, high-fidelity design philosophy tailored for dense data comprehension and micro-feedback accuracy. This design mirrors premium enterprise solutions like SAP Fiori, Oracle Redwood, and Microsoft Dynamics 365, while introducing modern glassmorphic overlays and subtle gradient glows typical of cutting-edge SaaS platforms.

### Core Experience Principles
1. **Architectural Honesty:** No pseudo-intellectual telemetry clutter. Real-time data fields, status tags, and clocks convey real organizational information.
2. **Visual Rhythm via Negative Space:** Intentional scaling of margins and paddings prevents layout fatigue in complex data grids.
3. **Micro-interactivity:** Interactive hover animations and spring-physics transitions emphasize cursor tracking, state cues, and system responsiveness.
4. **Offline & Sync Transparency:** Status indicators provide real-time connection status, avoiding mystery states.

---

## 2. Global Design Tokens

### A. Color Palette (Midnight Slate Theme)

| Token Name | Hex Code | Tailwind Equivalent | Use Case |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `#02050c` | `bg-[#02050c]` / `bg-slate-950` | Primary application layout container canvas |
| **Section Card Surface** | `#040815` | `bg-[#040815]` | Default block wrapper background, dialog drawers |
| **Accent Indigo** | `#6366f1` | `text-indigo-400` / `bg-indigo-600` | Call-to-actions, brand accents, hovered vectors |
| **Success Emerald** | `#10b981` | `text-emerald-400` / `bg-emerald-500` | In Stock badges, verified states, completed operations |
| **Warning Amber** | `#f59e0b` | `text-amber-400` / `bg-amber-500` | Low stock triggers, pending reviews, extended lead times |
| **Error Rose** | `#f43f5e` | `text-rose-400` / `bg-rose-500` | Out of Stock alerts, critical delays, actions cancelled |
| **Subtle Slate Borders**| `#111827` / `#1e293b` | `border-slate-900` / `border-slate-800` | Thin high-density structural separators, table borders |
| **Muted Slate Text** | `#64748b` | `text-slate-500` / `text-slate-400` | Descriptive labels, helper captions, timestamp logs |

---

### B. Typography & Scale Hierarchy

The design system utilizes **Inter** for standard UI elements and **JetBrains Mono** for numerical values, IDs, timestamps, status badges, and system states.

```css
/* Font Declarations within index.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
```

| Class | Font Family | Weight | Size | Line Height | Application |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Title** | `Inter` | Bold (700) | `24px - 30px` | `1.2` | App welcome headers, Page titles |
| **Section Title** | `Inter` | Semibold (600) | `14px` (0.875rem) | `1.4` | Section Card Header block |
| **Body Primary** | `Inter` | Regular (400) | `12px` (0.75rem) | `1.5` | Standard labels, table entries, paragraphs |
| **Data Monospace** | `JetBrains Mono` | Medium (500) | `11px` (0.6875rem)| `1.0` | SKU Codes, Ledger Currency, Indicators |
| **Badge Micro** | `JetBrains Mono` | Bold (700) | `8px - 9px` | `1.0` | Sourcing alerts, pill categories |

---

### C. Spacing System
Spacing follows a highly strict, compact structural multiplier to maximize readable content volume without inducing layout claustrophobia:

*   **Grid Gap:** `gap-4` ($16\text{px}$) for standard bento layouts; `gap-6` ($24\text{px}$) for large multi-column charts.
*   **Card Internal Padding:** `p-5` ($20\text{px}$) or `p-6` ($24\text{px}$) to frame dashboard statistics elegantly.
*   **Table Row Padding:** `py-3.5 px-4` to guarantee at least $44\text{px}$ touch targets and clean cell gutters on vertical scroll lines.

---

## 3. Micro-interactions & Animations

All transitions are GPU-accelerated and leverage Framer Motion/CSS Bezier timing functions for professional execution.

```css
/* Transition Timings inside index.css */
.sidebar-item-transition {
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}
```

1.  **Sidebar Interactions:** Inactive navigation links brighten on hover, applying a subtle indigo background glow (`rgba(99, 102, 241, 0.06)`) and a subtle purple outline glow over $220\text{ms}$. Active indicators remain static.
2.  **Dashboard Card Lift:** Interactive cards apply:
    ```css
    .card-hover-effect:hover {
      transform: translateY(-3px);
      border-color: rgba(99, 102, 241, 0.25) !important;
      box-shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.75), 0 0 20px 0 rgba(99, 102, 241, 0.04);
    }
    ```
3.  **Action Button Scale:** Action buttons leverage scaling transitions:
    ```css
    .button-hover-scale:hover {
      transform: scale(1.02);
      filter: brightness(1.1);
      box-shadow: 0 0 15px 0 rgba(99, 102, 241, 0.20);
    }
    ```
4.  **Table Rows:** Rows use pointer cursors and high-contrast background highlights (`rgba(99, 102, 241, 0.05)`) on cursor focus.
5.  **Page Transitions:** Tabs animate inside an `<AnimatePresence>` wrapper, performing a $250\text{ms}$ upward translation ($10\text{px}$) with an opacity fade-in on enter, and a corresponding fade-out on exit.

---

## 4. Reusable Layouts & Navigation Framework

The shell uses an ERP frame structure, utilizing a fixed sidebar, a blurred global top-header bar, and a single scrollable main content viewport.

### A. Fixed Top Navbar Header
*   **Organizational Context:** Prominently identifies organization details (`Acme Sourcing Hub`) and real-time environment syncing indicators.
*   **Environment Feedback:** Includes a dynamic UTC real-time clock to align multisite distribution centers.
*   **Active Alerts Bell:** Highlights pending supply alerts with a pulsing warning indicator. Employs a slide-out drawer list detailing warning levels and metadata.

### B. User Profile Dropdown Component
*   **Dynamic Container:** Click-to-open popover overlay on the top right.
*   **Anatomy:**
    *   *Header:* User metadata ("Alexander S." / "Lead Sourcing Admin").
    *   *Option Elements:* Profile settings, Preference panels, quick Midnight-to-Charcoal theme-switches.
    *   *Sign-out Action:* Crimson red text and logout icons.

---

## 5. Reusable UI Components & Tables

### A. Core Interactive Tables
All tables strictly conform to high-volume ERP grid standards.

```tsx
// Sticky headers and cursor highlight implementation
<tr className="border-b border-slate-900 bg-slate-950/25 sticky top-0 backdrop-blur-md">
```

1.  **Sticky Headers:** Header rows remain fixed at the top of the grid viewport on vertical scroll runs, bound by thin translucent bottom border elements.
2.  **Sort Indicators:** Active sort keys show dedicated arrow markers (Up/Down) highlighted in Indigo. Inactive columns reveal faint grey double arrows on hover to signify clickability.
3.  **Keyword Highlighting (`HighlightText`):** A custom React component split processes matching text segments matching queries dynamically. Matches are decorated in real time with an active overlay:
    ```tsx
    <mark className="bg-indigo-500/30 text-indigo-200 font-semibold px-0.5 rounded border border-indigo-500/20">
      {part}
    </mark>
    ```

### B. Enterprise Empty State Cards (`EmptyState`)
Displayed inside tables or sections when queried search results yield zero matching records, replacing blank states with actionable illustrations:

```tsx
export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 border border-slate-900 bg-[#040815]/60 rounded-2xl max-w-xl mx-auto">
      <Icon className="w-12 h-12 text-indigo-400" />
      <h3>{title}</h3>
      <p>{description}</p>
      {actionLabel && <button onClick={onAction}>{actionLabel}</button>}
    </div>
  );
}
```

---

## 6. Data Visualization Guidelines

To guarantee high rendering performance, zero external framework overhead, and full customization, all chart modules are constructed with responsive SVGs and animated utilizing standard `motion` paths.

### A. Line Plot Charts
*   **Line Pathing:** Employs quadratic Bezier segment controls (`Q`, `T` vectors) for fluid curves.
*   **Gradients:** Transparent-to-fading area gradients fill spaces below curves to emphasize visual balance.
*   **Interactive Tooltips:** Mouse trigger circles map along path nodes. Hovering renders dashed tracking lines and coordinates cards displaying unit costs and calendar months.

### B. Procurement Bar Charts
*   **Layout Structure:** Equal spacing proportions computed for monthly intervals.
*   **Transition Curves:** Interactive columns expand vertically from the bottom margin during tab entry transitions using smooth spring configurations.

---

## 7. Global Toast Notification System

Inventix features an elegant, stackable toast notification system positioned at the top-right to replace native browser alerts.

```tsx
interface ToastItem {
  id: number;
  message: string;
  type: "success" | "info" | "warning" | "error";
}
```

*   **Spring Physics:** Slides into view from the right margin while translating downwards. Exits use a shrink-to-dismiss exit animation.
*   **Visual Classification:**
    *   **Success:** Emerald border accents, emerald confirmation check marks, emerald base timers.
    *   **Warning:** Amber warnings and warning shields.
    *   **Error:** Rose icons and timers for critical exceptions.
    *   **Info:** Accent indigo indicators for system computations.
*   **Countdown Progress Timer:** An absolute progress line running along the bottom edge of each card, shrinking linearly over $4000\text{ms}$ to reflect remaining active status.

---

## 8. Skeleton Loading States & UX Principles

To maintain consistent layouts and prevent visual layout shifts during data loading or navigation, Inventix utilizes high-fidelity skeleton shimmers.

*   **Layout Continuity:** Blocks map to identical heights of finished cards.
*   **Shimmer Speed:** Pulse shimmers animate with standard ease-in-out properties over $1200\text{ms}$.
*   **Application Targets:**
    *   *KPI blocks:* Substituted with plain rectangular containers.
    *   *Grid Tables:* Render greyed-out cell rows and mock cells.
    *   *Charts:* Display plain card containers.

---

## 9. Accessibility (a11y) & Technical Constraints

1.  **Contrast Ratios:** Muted text elements must maintain a contrast ratio of at least `4.5:1` against dark card surfaces to align with WCAG AA guidelines.
2.  **Touch Targets:** Interactive components, pagination toggles, search rows, and buttons must measure at least $44\text{px}$ in width and height.
3.  **Focus States:** Active input boundaries display a high-contrast indigo border to guide keyboard navigators.
4.  **No direct window.alert calls:** Iframe environments prevent using blocking browser popups. All interactive confirmation alerts are managed through the modular toast system.

---
