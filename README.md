# 📦 Inventix

## AI-Powered Inventory & Procurement Management System

Inventix is a modern ERP platform that streamlines inventory, procurement, warehouse operations, vendor management, payments, reports, and AI-powered business insights for manufacturing and distribution companies.

Built using **React, TypeScript, Supabase, PostgreSQL, and Vite**, Inventix automates the complete procurement lifecycle through secure role-based access control and intelligent backend automation.

---

# 🌐 Live Demo

**Live Website:**  
https://inventix-tau.vercel.app/

**GitHub Repository:**  
https://github.com/saniyasyeda31ui/Inventix

---

# 📖 Overview

Inventix is designed to simplify and automate business operations by providing a centralized platform for managing products, warehouses, vendors, inventory, procurement, payments, reports, and AI-generated recommendations.

The application follows a real-world ERP workflow where every department collaborates through secure role-based access while maintaining data isolation using Supabase Row Level Security (RLS).

---

# ✨ Features

## 🔐 Authentication

- Secure Login & Registration
- Company Registration
- Password Reset
- Protected Routes

## 👥 Role-Based Access Control (RBAC)

- Admin
- Procurement Manager
- Warehouse Manager
- Finance Manager

Each role has access only to the modules required for their responsibilities.

---

## 📦 Inventory Management

- Live Inventory Tracking
- Safety Stock Monitoring
- Automatic Inventory Updates
- Warehouse Allocation

---

## 🏭 Warehouse Management

- Multiple Warehouses
- Capacity Monitoring
- Occupancy Tracking

---

## 🚚 Vendor Management

- Vendor Profiles
- Supplier Management
- Purchase Order Integration

---

## 📝 Procurement

- Purchase Requests
- Purchase Orders
- Approval Workflow
- Vendor Assignment

---

## 💰 Finance

- Vendor Payment Tracking
- Payment Records
- Financial Monitoring

---

## 📊 Reports

- Procurement Reports
- Inventory Reports
- Business Analytics

---

## 🤖 AI Insights

- Low Stock Recommendations
- Procurement Suggestions
- Inventory Optimization
- Business Insights generated from live operational data

---

# 🔄 Procurement Workflow

```text
Inventory falls below Safety Stock
            │
            ▼
Purchase Request Created
            │
            ▼
Purchase Request Approved
            │
            ▼
Purchase Order Generated
            │
            ▼
Purchase Order Sent to Vendor
            │
            ▼
Vendor Delivers Goods
            │
            ▼
Purchase Order Marked as Received
            │
            ▼
Inventory Updated Automatically
            │
            ▼
Activity Log Created
            │
            ▼
AI Recommendations Updated
```

---

# ⚡ Intelligent Automation

One of Inventix's core features is automated inventory synchronization powered by PostgreSQL database triggers.

When a Purchase Order is marked as **Received**, the system automatically:

- Updates inventory balances
- Allocates stock to the correct warehouse
- Creates activity logs
- Refreshes AI recommendations

This removes manual inventory updates and keeps procurement and inventory synchronized.

---

# 🛠 Tech Stack

| Category | Technology |
|-----------|------------|
| Frontend | React, TypeScript, Vite |
| Styling | CSS3 |
| Backend | Supabase |
| Database | PostgreSQL |
| Authentication | Supabase Auth |
| Security | Row Level Security (RLS), RBAC |
| Automation | PostgreSQL Triggers |
| Deployment | Vercel |

---

# 📸 Application Screenshots

> Replace these placeholders with actual screenshots.

- 🏠 Landing Page
- 📊 Dashboard
- 📦 Product Catalog
- 🏭 Warehouses
- 📋 Purchase Orders
- 📦 Inventory
- 🤖 AI Insights

---

# 📂 Project Structure

```text
Inventix/
│
├── src/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── context/
│   ├── data/
│   ├── lib/
│   └── utils/
│
├── supabase/
│   ├── migrations/
│   ├── functions/
│   └── config.toml
│
├── public/
├── package.json
└── vite.config.ts
```

---

# 🚀 Getting Started

### Clone the Repository

```bash
git clone https://github.com/saniyasyeda31ui/Inventix.git
```

### Navigate to the Project

```bash
cd Inventix
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file.

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

### Run the Development Server

```bash
npm run dev
```

---

# 🔒 Security

- Supabase Authentication
- Protected Routes
- Row Level Security (RLS)
- Role-Based Access Control
- Secure Multi-Tenant Architecture

---

# 🔮 Future Enhancements

- Barcode & QR Code Integration
- Mobile Application
- Supplier Performance Analytics
- Email Notifications
- Dashboard Customization
- Predictive Inventory Analytics

---

# 👩‍💻 Developer

## Syed Saniya

**B.Tech – Artificial Intelligence**

**GitHub**  
https://github.com/saniyasyeda31ui

**LinkedIn**  
https://www.linkedin.com/in/syed-saniya-06b8b532b/

---

## ⭐ Support

If you found this project useful or interesting, consider giving it a **Star** on GitHub.

Your support is greatly appreciated!