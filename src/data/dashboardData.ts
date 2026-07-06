export interface PurchaseRequest {
  id: string;
  requestedBy: string;
  department: string;
  supplier: string;
  expectedDelivery: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Pending" | "Approved" | "Rejected";
  amount: string;
  product_name: string;
  product_id?: string;
  quantity?: number;
  estimated_cost?: number;
  requestor_id?: string;
  unit?: string;
  lead_time_days?: number;
}

export interface Activity {
  id: number;
  action: string;
  type: "success" | "info" | "warning";
  timestamp: string;
  details: string;
}

export interface LiveStockItem {
  id: string;
  product_id: string;
  product_name: string;
  sku: string;
  category: string;
  unit: string;
  reorder_level: number;
  safety_stock: number;
  qty: number;
  warehouse: string;
  status: "Optimal" | "Low Stock" | "Critical" | "Transit" | "In Stock" | "Out of Stock";
}

export interface ProductItem {
  id: string;
  product_id: string;
  product_name: string;
  category: string;
  description?: string;
  unit: string;
  unitPrice: number;
  currentStock: number;
  reorderLevel: number;
  safetyStock: number;
  vendorId: string;
  primaryVendor: string; // derived from vendor_id
  leadTimeDays: number;
  notes?: string;
  sku?: string;
}

export interface WarehouseItem {
  id: string; // The code
  uuid?: string; // The db id
  name: string;
  location: string;
  manager: string;
  capacityUsed: number; // percentage
  totalAreaSqFt: number;
  status: "Active" | "Maintenance" | "At Capacity";
}

export interface VendorItem {
  id: string;
  uuid?: string;
  name: string;
  category: string;
  score: number; // 0-100
  onTime: string; // "98.2%"
  contact: string;
  email: string;
  status: "Preferred" | "Approved" | "Under Review" | "Suspended";
}

export interface PurchaseOrder {
  id: string; // Used for po_number in UI
  uuid?: string;
  purchase_request_id?: string;
  vendor_id?: string;
  vendorName: string;
  amount: string;
  total_amount?: number;
  dateCreated: string;
  deliveryDate: string;
  status: "Draft" | "Pending Approval" | "Sent" | "Partially Received" | "Completed" | "Cancelled";
  itemsCount: number;
  buyer: string;
}

export interface EmployeeItem {
  id: string; // Display ID (e.g. EMP-XXXX)
  uuid?: string;
  name: string;
  email: string;
  role: string; // Maps to 'title' in DB
  department: string;
  status: string;
  manager_id?: string | null;
}

export interface PaymentItem {
  id: string; // Used for invoice_number in UI
  uuid?: string;
  invoiceId: string;
  purchase_order_id?: string;
  purchase_order_number?: string;
  vendorName: string;
  amount_paid?: number;
  amount: string; // Formatted
  dueDate: string;
  status: "Paid" | "Pending" | "Overdue" | "Processing" | "Unpaid" | "Disputed";
  method: "ACH" | "ACH Transfer" | "Wire" | "Wire Transfer" | "Credit Card" | "Check";
}

export interface AIRecommendation {
  id: string | number;
  product_id?: string;
  product_name: string;
  alert: string;
  reorderQty: number;
  alternativeSupplier: string;
  priceReduction: string;
  estimatedSavings: string;
  severity: "high" | "medium" | "low";
}

// MOCK DATASETS

export const initialPurchaseRequests: PurchaseRequest[] = [
  { 
    id: "PR-2026-001", 
    requestedBy: "Sarah Jenkins", 
    department: "Operations", 
    supplier: "Global Plastics Corp", 
    expectedDelivery: "2026-07-10", 
    priority: "High", 
    status: "Pending", 
    amount: "$12,450", 
    product_name: "High-Density Polymer Reels" 
  },
  { 
    id: "PR-2026-002", 
    requestedBy: "David Chen", 
    department: "Engineering", 
    supplier: "Intel Sourcing", 
    expectedDelivery: "2026-07-05", 
    priority: "Critical", 
    status: "Approved", 
    amount: "$45,000", 
    product_name: "Silicon-Wafers (Tier-1)" 
  },
  { 
    id: "PR-2026-003", 
    requestedBy: "Elena Rostova", 
    department: "Maintenance", 
    supplier: "SteelWorks Ltd", 
    expectedDelivery: "2026-07-12", 
    priority: "Medium", 
    status: "Pending", 
    amount: "$8,200", 
    product_name: "Grade-X Copper Tubing" 
  },
  { 
    id: "PR-2026-004", 
    requestedBy: "Marcus Vance", 
    department: "Logistics", 
    supplier: "Apex Logistics Ltd", 
    expectedDelivery: "2026-07-08", 
    priority: "Low", 
    status: "Approved", 
    amount: "$3,100", 
    product_name: "Industrial Storage Pallets" 
  },
  { 
    id: "PR-2026-005", 
    requestedBy: "Aisha Rahman", 
    department: "Procurement", 
    supplier: "Belgrave Chemicals", 
    expectedDelivery: "2026-07-15", 
    priority: "High", 
    status: "Rejected", 
    amount: "$15,600", 
    product_name: "Lithium-Ion Cylinders" 
  },
  { 
    id: "PR-2026-006", 
    requestedBy: "Robert Alvarez", 
    department: "Operations", 
    supplier: "Valves & Fittings Inc", 
    expectedDelivery: "2026-07-20", 
    priority: "Medium", 
    status: "Pending", 
    amount: "$5,400", 
    product_name: "Pressure Relief Valves" 
  },
  {
    id: "PR-2026-007",
    requestedBy: "Sarah Jenkins",
    department: "Operations",
    supplier: "SteelWorks Ltd",
    expectedDelivery: "2026-07-22",
    priority: "High",
    status: "Approved",
    amount: "$22,100",
    product_name: "Reinforced Steel Struts"
  },
  {
    id: "PR-2026-008",
    requestedBy: "David Chen",
    department: "Engineering",
    supplier: "Global Plastics Corp",
    expectedDelivery: "2026-07-25",
    priority: "Low",
    status: "Pending",
    amount: "$1,800",
    product_name: "Nylon Insulator Spacers"
  }
];

export const initialRecentActivities: Activity[] = [
  { id: 1, action: "Purchase Order PO-12095 approved", type: "success", timestamp: "10 mins ago", details: "Approved by Admin Dunlap" },
  { id: 2, action: "Vendor ABC Metals added to approved list", type: "info", timestamp: "1 hour ago", details: "Certified with Grade-X raw metals" },
  { id: 3, action: "Stock transferred to Bangalore Warehouse", type: "success", timestamp: "3 hours ago", details: "450 units of Silicon Wafers" },
  { id: 4, action: "Delivery received from Global Plastics", type: "success", timestamp: "5 hours ago", details: "1,200 units of Polyethylene" },
  { id: 5, action: "Low stock alert generated for Copper Tubing", type: "warning", timestamp: "Yesterday", details: "Below safety threshold of 5,000 units" },
  { id: 6, action: "Inventory synchronized across all 5 warehouses", type: "info", timestamp: "Yesterday", details: "Data integrity audit passed with 99.9% accuracy" },
];

export const initialLiveStock: LiveStockItem[] = [
  { id: "STK-101", product_id: "PRD-000201", product_name: "Copper Tubing (Grade-X)", sku: "COP-TUB-X500", category: "Bulk Materials", unit: "m", reorder_level: 500, safety_stock: 200, qty: 12500, warehouse: "Chicago Warehouse", status: "Optimal" },
  { id: "STK-102", product_id: "PRD-000202", product_name: "Lithium-Ion Cylinders (Type B)", sku: "LITH-CYL-B820", category: "Energy Cells", unit: "pcs", reorder_level: 200, safety_stock: 50, qty: 8200, warehouse: "Rotterdam Warehouse", status: "Transit" },
  { id: "STK-103", product_id: "PRD-000203", product_name: "Silicon-Wafers (Tier-1 Enterprise)", sku: "SIL-WAF-T100", category: "Semiconductors", unit: "pcs", reorder_level: 150, safety_stock: 50, qty: 4200, warehouse: "Singapore Warehouse", status: "Low Stock" },
  { id: "STK-104", product_id: "PRD-000204", product_name: "Structural Carbon Steel Bars", sku: "CARB-ST-S910", category: "Metals", unit: "kg", reorder_level: 100, safety_stock: 20, qty: 150, warehouse: "Bangalore Warehouse", status: "Critical" },
  { id: "STK-105", product_id: "PRD-000205", product_name: "High-Density Polymer Reels", sku: "POLY-HD-R400", category: "Plastics", unit: "reels", reorder_level: 300, safety_stock: 100, qty: 6100, warehouse: "Rotterdam Warehouse", status: "Optimal" }
];

export const initialProducts: ProductItem[] = [
  { id: "uuid-1", product_id: "PRD-000201", product_name: "Copper Tubing (Grade-X)", sku: "COP-TUB-X500", category: "Bulk Materials", unit: "m", unitPrice: 12.50, currentStock: 1500, reorderLevel: 500, safetyStock: 200, vendorId: "VEN-001", primaryVendor: "SteelWorks Ltd", leadTimeDays: 7 },
  { id: "uuid-2", product_id: "PRD-000202", product_name: "Lithium-Ion Cylinders (Type B)", sku: "LITH-CYL-B820", category: "Energy Cells", unit: "pcs", unitPrice: 35.00, currentStock: 820, reorderLevel: 200, safetyStock: 50, vendorId: "VEN-004", primaryVendor: "Belgrave Chemicals", leadTimeDays: 14 },
  { id: "uuid-3", product_id: "PRD-000203", product_name: "Silicon-Wafers (Tier-1 Enterprise)", sku: "SIL-WAF-T100", category: "Semiconductors", unit: "pcs", unitPrice: 125.00, currentStock: 120, reorderLevel: 150, safetyStock: 50, vendorId: "VEN-002", primaryVendor: "Intel Sourcing", leadTimeDays: 21 },
  { id: "uuid-4", product_id: "PRD-000204", product_name: "Structural Carbon Steel Bars", sku: "CARB-ST-S910", category: "Metals", unit: "kg", unitPrice: 48.00, currentStock: 45, reorderLevel: 100, safetyStock: 20, vendorId: "VEN-001", primaryVendor: "SteelWorks Ltd", leadTimeDays: 5 },
  { id: "uuid-5", product_id: "PRD-000205", product_name: "High-Density Polymer Reels", sku: "POLY-HD-R400", category: "Plastics", unit: "reels", unitPrice: 9.20, currentStock: 1200, reorderLevel: 300, safetyStock: 100, vendorId: "VEN-003", primaryVendor: "Global Plastics Corp", leadTimeDays: 8 },
  { id: "uuid-6", product_id: "PRD-000206", product_name: "Ceramic Terminal Blocks", sku: "CER-TERM-B20", category: "Components", unit: "pcs", unitPrice: 4.50, currentStock: 4500, reorderLevel: 1000, safetyStock: 200, vendorId: "VEN-005", primaryVendor: "Valves & Fittings Inc", leadTimeDays: 4 },
  { id: "uuid-7", product_id: "PRD-000207", product_name: "Titanium Alloy Hex Fasteners", sku: "TIT-ALL-F44", category: "Components", unit: "pcs", unitPrice: 15.80, currentStock: 800, reorderLevel: 250, safetyStock: 100, vendorId: "VEN-001", primaryVendor: "SteelWorks Ltd", leadTimeDays: 10 },
  { id: "uuid-8", product_id: "PRD-000208", product_name: "Pressure Relief Valves", sku: "VALV-PRE-V12", category: "Components", unit: "pcs", unitPrice: 85.00, currentStock: 320, reorderLevel: 100, safetyStock: 30, vendorId: "VEN-005", primaryVendor: "Valves & Fittings Inc", leadTimeDays: 12 }
];

export const initialWarehouses: WarehouseItem[] = [
  { id: "WH-001", name: "Chicago Warehouse", location: "Midwest Logistics Hub, IL", manager: "Sarah Jenkins", capacityUsed: 85, totalAreaSqFt: 120000, status: "Active" },
  { id: "WH-002", name: "Rotterdam Warehouse", location: "Europort Zone, Netherlands", manager: "Dirk van Dijk", capacityUsed: 72, totalAreaSqFt: 250000, status: "Active" },
  { id: "WH-003", name: "Singapore Warehouse", location: "Changi Logistics Complex, Singapore", manager: "Li Wei Chen", capacityUsed: 90, totalAreaSqFt: 180000, status: "At Capacity" },
  { id: "WH-004", name: "Bangalore Warehouse", location: "Whitefield Sector 4, India", manager: "Rohan Naidu", capacityUsed: 60, totalAreaSqFt: 95000, status: "Active" },
  { id: "WH-005", name: "Houston Storage Yard", location: "Gulf Port Terminals, TX", manager: "Buck Austin", capacityUsed: 35, totalAreaSqFt: 80000, status: "Active" }
];

export const initialVendors: VendorItem[] = [
  { id: "VEN-001", name: "SteelWorks Ltd", category: "Metals", score: 96, onTime: "98.2%", contact: "James Henderson", email: "j.henderson@steelworks.com", status: "Preferred" },
  { id: "VEN-002", name: "Intel Sourcing", category: "Semiconductors", score: 94, onTime: "92.5%", contact: "Marcus Chen", email: "m.chen@intelsourcing.com", status: "Preferred" },
  { id: "VEN-003", name: "Global Plastics Corp", category: "Plastics", score: 92, onTime: "95.0%", contact: "Elena Geller", email: "geller@globalplastics.com", status: "Approved" },
  { id: "VEN-004", name: "Belgrave Chemicals", category: "Energy Cells", score: 89, onTime: "90.1%", contact: "Arthur Pendelton", email: "pendelton@belgrave.org", status: "Under Review" },
  { id: "VEN-005", name: "Valves & Fittings Inc", category: "Components", score: 91, onTime: "96.4%", contact: "Rita Gomez", email: "rgomez@valvesfittings.com", status: "Approved" },
  { id: "VEN-006", name: "Apex Logistics Ltd", category: "Freight Forwarding", score: 84, onTime: "88.9%", contact: "Marcus Vance", email: "vance@apexlog.co.uk", status: "Under Review" }
];

export const initialPurchaseOrders: PurchaseOrder[] = [
  { id: "PO-2026-501", vendorName: "Intel Sourcing", amount: "$125,000", dateCreated: "2026-06-15", deliveryDate: "2026-07-05", status: "Sent", itemsCount: 1000, buyer: "Alexander S." },
  { id: "PO-2026-502", vendorName: "SteelWorks Ltd", amount: "$45,200", dateCreated: "2026-06-20", deliveryDate: "2026-07-02", status: "Completed", itemsCount: 1500, buyer: "Alexander S." },
  { id: "PO-2026-503", vendorName: "Global Plastics Corp", amount: "$18,500", dateCreated: "2026-06-22", deliveryDate: "2026-07-10", status: "Sent", itemsCount: 2000, buyer: "Sarah Jenkins" },
  { id: "PO-2026-504", vendorName: "Valves & Fittings Inc", amount: "$8,400", dateCreated: "2026-06-25", deliveryDate: "2026-07-15", status: "Draft", itemsCount: 100, buyer: "Elena Rostova" },
  { id: "PO-2026-505", vendorName: "Belgrave Chemicals", amount: "$62,000", dateCreated: "2026-06-28", deliveryDate: "2026-07-20", status: "Pending Approval", itemsCount: 500, buyer: "Alexander S." }
];

export const initialEmployees: EmployeeItem[] = [
  { id: "EMP-001", name: "Alexander S.", email: "alexander.s@inventix-erp.com", role: "Lead Administrator", department: "Procurement", status: "Active" },
  { id: "EMP-002", name: "Sarah Jenkins", email: "s.jenkins@inventix-erp.com", role: "Warehouse Manager", department: "Operations", status: "Active" },
  { id: "EMP-003", name: "David Chen", email: "d.chen@inventix-erp.com", role: "Procurement Specialist", department: "Procurement", status: "Active" },
  { id: "EMP-004", name: "Elena Rostova", email: "e.rostova@inventix-erp.com", role: "Inventory Auditor", department: "Logistics", status: "Active" },
  { id: "EMP-005", name: "Rohan Naidu", email: "r.naidu@inventix-erp.com", role: "Warehouse Manager", department: "Operations", status: "On Leave" }
];

export const initialPayments: PaymentItem[] = [
  { id: "PAY-1001", invoiceId: "INV-2026-890", vendorName: "SteelWorks Ltd", amount: "$45,200.00", dueDate: "2026-06-30", status: "Paid", method: "ACH Transfer" },
  { id: "PAY-1002", invoiceId: "INV-2026-904", vendorName: "Intel Sourcing", amount: "$125,000.00", dueDate: "2026-07-05", status: "Processing", method: "Wire Transfer" },
  { id: "PAY-1003", invoiceId: "INV-2026-911", vendorName: "Global Plastics Corp", amount: "$18,500.00", dueDate: "2026-07-15", status: "Pending", method: "ACH Transfer" },
  { id: "PAY-1004", invoiceId: "INV-2026-918", vendorName: "Valves & Fittings Inc", amount: "$8,400.00", dueDate: "2026-07-25", status: "Pending", method: "Credit Card" },
  { id: "PAY-1005", invoiceId: "INV-2026-844", vendorName: "Belgrave Chemicals", amount: "$12,300.00", dueDate: "2026-06-20", status: "Overdue", method: "ACH Transfer" }
];

export const vendorPerformance = [
  { name: "SteelWorks Ltd", score: 96, category: "Metals", onTime: "98.2%", status: "Tier-1 Preferred" },
  { name: "Intel Sourcing", score: 94, category: "Semiconductors", onTime: "92.5%", status: "Tier-1 Preferred" },
  { name: "Global Plastics Corp", score: 92, category: "Plastics", onTime: "95.0%", status: "Approved" },
  { name: "Belgrave Chemicals", score: 89, category: "Energy Cells", onTime: "90.1%", status: "Under Review" },
];

export const warehouseCapacity = [
  { name: "Chicago Warehouse", current: 85000, max: 100000, pct: 85, fill: "#6366f1" },
  { name: "Rotterdam Warehouse", current: 72000, max: 100000, pct: 72, fill: "#818cf8" },
  { name: "Singapore Warehouse", current: 90000, max: 100000, pct: 90, fill: "#a5b4fc" },
  { name: "Bangalore Warehouse", current: 48000, max: 80000, pct: 60, fill: "#c7d2fe" },
];
