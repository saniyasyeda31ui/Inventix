import * as lucide from 'lucide-react';

const icons = [
  "LayoutDashboard", "Warehouse", "Package", "Users", "Receipt", 
  "BarChart2", "Bell", "LogOut", "ArrowUpRight", 
  "Settings", "AlertTriangle", "DollarSign", "Activity", "FileText",
  "Search", "Plus", "CheckCircle", "Clock", "XCircle", "AlertCircle", "Filter", "ShieldAlert",
  "ChevronLeft", "ChevronRight", "Info", "Sparkles", "TrendingUp", "Sun", "Moon", 
  "X", "Check", "FileSpreadsheet", "Building2", "CreditCard", "Layers",
  "ShoppingBag", "Truck", "Calendar", "Sliders", "Menu", "ChevronDown",
  "Box", "UserPlus", "Target", "Zap", "ShoppingCart", "TrendingDown"
];

for (const name of icons) {
  if (!lucide[name]) {
    console.error("Missing icon:", name);
  }
}
console.log("Done checking icons.");
