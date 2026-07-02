import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Warehouse, Package, Users, Receipt, 
  BarChart2, Bell, LogOut, ArrowUpRight, 
  Settings, AlertTriangle, DollarSign, Activity, FileText,
  Search, Plus, CheckCircle, Clock, XCircle, AlertCircle, Filter, 
  ChevronLeft, ChevronRight, Info, Sparkles, TrendingUp, Sun, Moon, 
  X, Check, FileSpreadsheet, Building2, CreditCard, Layers,
  ShoppingBag, Truck, Calendar, Sliders, Menu
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import SkeletonLoader from "../components/SkeletonLoader";

import {
  initialPurchaseRequests,
  initialRecentActivities,
  initialLiveStock,
  PurchaseRequest,
  Activity as LogActivity,
  LiveStockItem
} from "../data/dashboardData";

// Modular Section Imports
import OverviewSection from "../components/OverviewSection";
import ProductsSection from "../components/ProductsSection";
import WarehousesSection from "../components/WarehousesSection";
import InventorySection from "../components/InventorySection";
import VendorsSection from "../components/VendorsSection";
import PurchaseRequestsSection from "../components/PurchaseRequestsSection";
import PurchaseOrdersSection from "../components/PurchaseOrdersSection";
import ReportsSection from "../components/ReportsSection";
import AIInsightsSection from "../components/AIInsightsSection";
import CompanySection from "../components/CompanySection";
import EmployeesSection from "../components/EmployeesSection";
import PaymentsSection from "../components/PaymentsSection";
import SettingsSection from "../components/SettingsSection";
import { useNotifications } from '../hooks/useNotifications';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  
  // Dynamic Active View Tab State
  const [activeTab, setActiveTab] = useState<string>("Overview");

  // Mobile navigation states
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Real-time states
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>(initialPurchaseRequests);
  const [recentActivities, setRecentActivities] = useState<LogActivity[]>(initialRecentActivities);
  const [liveStock, setLiveStock] = useState<LiveStockItem[]>(initialLiveStock);
  const [activeAlerts, setActiveAlerts] = useState([
    { id: 1, message: "Silicon-Wafers (Singapore Warehouse) low on stock. Current: 4,200 / Min: 5,000", type: "warning" },
    { id: 2, message: "Purchase Order PO-12095 created and sent to Intel Sourcing", type: "info" }
  ]);

  // Global Search Query
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");

  // Live Notifications from Supabase
  const {
    notifications,
    loading: notiLoading,
    error: notiError,
    unreadCount,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notiFilter, setNotiFilter] = useState<"all" | "unread">("all");

  // Theme state
  const [themeMode, setThemeMode] = useState<"slate" | "charcoal">("slate");

  // Interaction feedback states (Toasts List)
  interface ToastItem {
    id: number;
    message: string;
    type: "success" | "info" | "warning" | "error";
  }
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Skeleton tab loading state
  const [isTabLoading, setIsTabLoading] = useState(false);

  // User Profile Dropdown state
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Modals state
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Form Fields
  const [newProduct, setNewProduct] = useState({ name: "", sku: "", sector: "Bulk Materials", qty: 1000, warehouse: "Chicago Warehouse" });
  const [newRequest, setNewRequest] = useState({ item: "", requestedBy: "Alexander S.", department: "Procurement", supplier: "Global Plastics Corp", priority: "Medium" as const, amount: "5000", expectedDelivery: "2026-07-15" });
  const [newVendor, setNewVendor] = useState({ name: "", category: "Metals", onTime: "95.0%", status: "Approved" });
  const [newWarehouse, setNewWarehouse] = useState({ name: "", location: "Texas Hub", capacity: 80 });
  const [receiveProductSku, setReceiveProductSku] = useState("");
  const [receiveProductQty, setReceiveProductQty] = useState(500);
  const [reportType, setReportType] = useState("Inventory Value Summary");

  useEffect(() => {
    const updateTimeAndDate = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
      setCurrentDate(now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    };
    updateTimeAndDate();
    const timer = setInterval(updateTimeAndDate, 1000);
    return () => clearInterval(timer);
  }, []);

  // Trigger skeleton loader shimmer on tab switch
  useEffect(() => {
    setIsTabLoading(true);
    const timer = setTimeout(() => {
      setIsTabLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleLogout = () => {
    navigate("/");
  };

  const showToast = (message: string, type: "success" | "info" | "warning" | "error" = "success") => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type: type as any }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleDismissAlert = (id: number) => {
    setActiveAlerts(activeAlerts.filter(a => a.id !== id));
  };

  const handleOpenModal = (modalName: string) => {
    setActiveModal(modalName);
  };

  // Quick Action: Add Product Submit
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.sku) {
      showToast("Please fill out all product fields", "info");
      return;
    }
    const item: LiveStockItem = {
      id: "STK-" + (100 + liveStock.length + 1),
      name: newProduct.name,
      sku: newProduct.sku,
      sector: newProduct.sector,
      qty: Number(newProduct.qty),
      warehouse: newProduct.warehouse,
      status: Number(newProduct.qty) < 2000 ? "Low Stock" : "Optimal"
    };
    setLiveStock([item, ...liveStock]);
    
    // Log Activity
    const log: LogActivity = {
      id: Date.now(),
      action: `Product ${newProduct.name} registered`,
      type: "success",
      timestamp: "Just now",
      details: `Added ${newProduct.qty} units to ${newProduct.warehouse}`
    };
    setRecentActivities([log, ...recentActivities]);
    
    showToast(`Successfully registered ${newProduct.name}!`, "success");
    setActiveModal(null);
    setNewProduct({ name: "", sku: "", sector: "Bulk Materials", qty: 1000, warehouse: "Chicago Warehouse" });
  };

  // Quick Action: Add Purchase Request
  const handleAddRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequest.item || !newRequest.amount) {
      showToast("Please fill out all request fields", "info");
      return;
    }
    const item: PurchaseRequest = {
      id: `PR-2026-00${purchaseRequests.length + 1}`,
      requestedBy: newRequest.requestedBy,
      department: newRequest.department,
      supplier: newRequest.supplier,
      expectedDelivery: newRequest.expectedDelivery,
      priority: newRequest.priority,
      status: "Pending",
      amount: "$" + Number(newRequest.amount).toLocaleString(),
      item: newRequest.item
    };
    setPurchaseRequests([item, ...purchaseRequests]);

    // Log Activity
    const log: LogActivity = {
      id: Date.now(),
      action: `Purchase request ${item.id} created`,
      type: "info",
      timestamp: "Just now",
      details: `${newRequest.item} worth $${Number(newRequest.amount).toLocaleString()} requested by ${newRequest.requestedBy}`
    };
    setRecentActivities([log, ...recentActivities]);

    showToast(`Created purchase request ${item.id} for ${newRequest.item}`, "success");
    setActiveModal(null);
    setNewRequest({ item: "", requestedBy: "Alexander S.", department: "Procurement", supplier: "Global Plastics Corp", priority: "Medium", amount: "5000", expectedDelivery: "2026-07-15" });
  };

  // Quick Action: Receive Stock
  const handleReceiveStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiveProductSku) {
      showToast("Please specify a stock item to receive", "info");
      return;
    }
    const updated = liveStock.map(item => {
      if (item.sku === receiveProductSku) {
        const newQty = item.qty + Number(receiveProductQty);
        return {
          ...item,
          qty: newQty,
          status: (newQty < 2000 ? "Low Stock" : "Optimal") as any
        };
      }
      return item;
    });
    setLiveStock(updated);

    const match = liveStock.find(i => i.sku === receiveProductSku);
    const prodName = match ? match.name : receiveProductSku;

    const log: LogActivity = {
      id: Date.now(),
      action: `Received delivery for ${prodName}`,
      type: "success",
      timestamp: "Just now",
      details: `Added ${receiveProductQty} units of stock via receiving slip.`
    };
    setRecentActivities([log, ...recentActivities]);

    showToast(`Successfully received ${receiveProductQty} units for SKU ${receiveProductSku}!`, "success");
    setActiveModal(null);
    setReceiveProductSku("");
  };

  const toggleTheme = () => {
    const newTheme = themeMode === "slate" ? "charcoal" : "slate";
    setThemeMode(newTheme);
    showToast(`Workspace backdrop toggled to ${newTheme === "slate" ? "Slate Midnight" : "Charcoal Black"}.`, "info");
  };

  // markAllAsRead is now provided by useNotifications hook

  // Render Section dynamically based on active tab
  const renderActiveSection = () => {
    switch (activeTab) {
      case "Overview":
        return (
          <OverviewSection
            liveStock={liveStock}
            purchaseRequests={purchaseRequests}
            recentActivities={recentActivities}
            activeAlerts={activeAlerts}
            onDismissAlert={handleDismissAlert}
            onOpenModal={handleOpenModal}
            onTabChange={(tab) => {
              setActiveTab(tab);
              window.scrollTo(0, 0);
            }}
          />
        );
      case "Products":
        return <ProductsSection onShowToast={showToast} onOpenModal={handleOpenModal} />;
      case "Warehouses":
        return <WarehousesSection onShowToast={showToast} onOpenModal={handleOpenModal} />;
      case "Inventory":
        return <InventorySection onShowToast={showToast} />;
      case "Vendors":
        return <VendorsSection onShowToast={showToast} onOpenModal={handleOpenModal} />;
      case "Purchase Requests":
        return <PurchaseRequestsSection onShowToast={showToast} onOpenModal={handleOpenModal} />;
      case "Purchase Orders":
        return <PurchaseOrdersSection onShowToast={showToast} onOpenModal={handleOpenModal} />;
      case "Reports":
        return <ReportsSection onShowToast={showToast} />;
      case "AI Insights":
        return <AIInsightsSection onShowToast={showToast} />;
      case "Company":
        return <CompanySection onShowToast={showToast} />;
      case "Employees":
        return <EmployeesSection onShowToast={showToast} onOpenModal={handleOpenModal} />;
      case "Payments":
        return <PaymentsSection onShowToast={showToast} />;
      case "Settings":
        return <SettingsSection onShowToast={showToast} />;
      default:
        return (
          <div className="p-8 text-center border border-slate-900 rounded-2xl bg-[#040815] space-y-3">
            <h3 className="text-sm font-bold text-slate-300">Section Under Development</h3>
            <p className="text-xs text-slate-500">This module is under construction according to secure enterprise SLA specs.</p>
          </div>
        );
    }
  };

  // Sidebar Menu Config
  const sidebarMenu = [
    {
      category: "Dashboard",
      items: [
        { name: "Overview", icon: LayoutDashboard }
      ]
    },
    {
      category: "Inventory",
      items: [
        { name: "Products", icon: Package },
        { name: "Warehouses", icon: Warehouse },
        { name: "Inventory", icon: Sliders }
      ]
    },
    {
      category: "Procurement",
      items: [
        { name: "Vendors", icon: Users },
        { name: "Purchase Requests", icon: ShoppingBag },
        { name: "Purchase Orders", icon: Receipt }
      ]
    },
    {
      category: "Analytics",
      items: [
        { name: "Reports", icon: FileText },
        { name: "AI Insights", icon: Sparkles }
      ]
    },
    {
      category: "Administration",
      items: [
        { name: "Company", icon: Building2 },
        { name: "Employees", icon: Users },
        { name: "Payments", icon: CreditCard },
        { name: "Settings", icon: Settings }
      ]
    }
  ];

  return (
    <div className={`h-screen flex flex-col font-sans overflow-hidden transition-colors duration-300 ${
      themeMode === "slate" ? "bg-[#02050c] text-slate-100" : "bg-[#080b12] text-slate-100"
    }`}>
      
      {/* Toast Notification Stack Container */}
      <div className="fixed top-5 right-5 z-[200] flex flex-col gap-3 max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="pointer-events-auto bg-[#050a1a]/95 backdrop-blur-md border border-slate-900 rounded-xl p-3.5 shadow-2xl flex items-center gap-3 w-80 relative overflow-hidden"
            >
              {/* Progress countdown indicator line */}
              <motion.div 
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 4, ease: "linear" }}
                className={`absolute bottom-0 left-0 h-0.5 ${
                  toast.type === "success" ? "bg-emerald-500" :
                  toast.type === "error" ? "bg-rose-500" :
                  toast.type === "warning" ? "bg-amber-500" : "bg-indigo-500"
                }`}
              />
              
              {/* Toast Type Icons */}
              {toast.type === "success" && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
              {toast.type === "error" && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              {toast.type === "warning" && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
              {toast.type === "info" && <Info className="w-4 h-4 text-indigo-400 shrink-0" />}

              {/* Message */}
              <div className="flex-1 text-xs font-semibold text-slate-100 pr-3">{toast.message}</div>

              {/* Close Icon */}
              <button 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-slate-500 hover:text-slate-300 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Notifications Slide-Out Drawer Panel */}
      <AnimatePresence>
        {showNotifications && (
          <>
            {/* Backdrop Layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotifications(false)}
              className="fixed inset-0 bg-black z-[110] cursor-pointer"
            />
            
            {/* Slide-out Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-full sm:w-96 h-full bg-[#040815] border-l border-slate-900 z-[120] p-6 shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-900">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-bold text-white uppercase tracking-wider font-mono">ERP Alerts Feed</span>
                  </div>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="p-1.5 rounded-lg border border-slate-900 bg-slate-950/40 hover:bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Filters Tab Bar */}
                <div className="flex gap-2 p-1 rounded-xl bg-slate-950/40 border border-slate-900">
                  <button
                    onClick={() => setNotiFilter("all")}
                    className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      notiFilter === "all" ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/10 font-bold" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    All ({notifications.length})
                  </button>
                  <button
                    onClick={() => setNotiFilter("unread")}
                    className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      notiFilter === "unread" ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/10 font-bold" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    Unread ({unreadCount})
                  </button>
                </div>

                {/* Alerts List */}
                <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
                  {notiLoading ? (
                    // Loading skeletons
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={`noti-skeleton-${i}`} className="p-3 rounded-xl border border-slate-900/60 space-y-2 animate-pulse">
                        <div className="flex items-center justify-between">
                          <div className="h-3 w-32 rounded bg-slate-800" />
                          <div className="h-2.5 w-10 rounded bg-slate-800" />
                        </div>
                        <div className="h-2.5 w-full rounded bg-slate-800" />
                        <div className="h-2.5 w-3/4 rounded bg-slate-800" />
                      </div>
                    ))
                  ) : notiError ? (
                    // Error state
                    <div className="py-8 text-center space-y-2">
                      <p className="text-xs text-rose-400 font-semibold">Failed to load notifications</p>
                      <p className="text-[10px] text-slate-500">{notiError}</p>
                      <button
                        onClick={refreshNotifications}
                        className="text-[10px] font-mono font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer"
                      >
                        Retry
                      </button>
                    </div>
                  ) : notifications.filter(n => notiFilter === "all" || !n.read).length > 0 ? (
                    notifications.filter(n => notiFilter === "all" || !n.read).map(n => (
                      <div 
                        key={n.id} 
                        className={`p-3 rounded-xl text-left text-xs border border-slate-900/60 transition-all ${
                          n.read 
                            ? "bg-transparent opacity-60" 
                            : "bg-indigo-500/[0.03] border-l-2 border-l-indigo-500 pl-2.5"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200">{n.title}</span>
                          <span className="text-[9px] font-mono text-slate-500">{n.time_label}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{n.description}</p>
                        
                        {!n.read && (
                          <button
                            onClick={() => {
                              markAsRead(n.id);
                              showToast(`Marked "${n.title}" as read`, "success");
                            }}
                            className="text-[9px] font-mono font-bold text-indigo-400 hover:text-indigo-300 mt-2 block cursor-pointer"
                          >
                            Mark as Read
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center text-slate-500 text-xs">
                      No notifications found.
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-900/60 flex items-center justify-between gap-4">
                <button
                  onClick={async () => {
                    await markAllAsRead();
                    showToast("All notifications marked as read.", "success");
                  }}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
                >
                  Mark all read
                </button>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="px-4 py-2 bg-slate-950 border border-slate-900 hover:bg-slate-900 rounded-xl text-xs font-semibold text-slate-300 cursor-pointer"
                >
                  Close Panel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Top Fixed Header / Navbar */}
      <header className="border-b border-slate-900 bg-[#040814]/90 backdrop-blur-md shrink-0 px-6 py-4 flex items-center justify-between z-50 h-[73px]">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          {/* Mobile Hamburg menu */}
          <button 
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 -ml-2 rounded-lg border border-slate-900 bg-slate-950/40 text-slate-400 hover:text-white lg:hidden cursor-pointer"
          >
            <Menu className="w-4.5 h-4.5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/10">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-base text-white leading-none tracking-tight">Inventix</span>
                <span className="px-1.5 py-0.5 text-[8px] font-mono rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest font-bold">
                  ERP v2.6
                </span>
              </div>
              <p className="text-[9px] text-slate-500 font-mono mt-0.5">Acme Industrial Sourcing</p>
            </div>
          </div>
        </div>

        {/* Global Real-time Clock */}
        <div className="hidden md:flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-600" />
            <span>{currentTime || "00:00:00"}</span>
          </div>
          <span className="text-slate-800">|</span>
          <span className="text-slate-500 font-medium">{currentDate || "Loading ERP Node..."}</span>
        </div>

        {/* Actions & Profile Dropdown */}
        <div className="flex items-center gap-3">
          
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-900 bg-slate-950/40 hover:bg-slate-900/60 transition-colors text-slate-400 hover:text-white cursor-pointer"
            title="Toggle Backdrop Theme"
          >
            {themeMode === "slate" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Notifications Trigger Bell */}
          <button 
            onClick={() => {
              setShowNotifications(true);
              setNotiFilter("all");
              refreshNotifications();
            }}
            className="p-2 rounded-xl border border-slate-900 bg-slate-950/40 hover:bg-slate-900/60 transition-colors text-slate-400 hover:text-white relative cursor-pointer"
            title="Sourcing Alerts Feed"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>
          
          <div className="h-6 w-px bg-slate-900 hidden sm:block" />
          
          {/* User Profile Area with Animated Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 p-1.5 rounded-xl border border-slate-900/60 hover:border-slate-800/80 bg-slate-950/20 hover:bg-slate-950/40 transition-all text-left cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600/15 border border-indigo-500/25 flex items-center justify-center text-xs font-bold text-indigo-400 uppercase">
                AS
              </div>
              <div className="hidden md:block pr-1">
                <div className="text-xs font-bold text-white leading-tight">Alexander S.</div>
                <p className="text-[9px] text-slate-500 font-mono">Lead Sourcing Admin</p>
              </div>
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <>
                  {/* Backdrop Click-Away trigger */}
                  <div className="fixed inset-0 z-[60]" onClick={() => setIsProfileOpen(false)} />
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 bg-[#050914] border border-slate-900 rounded-xl shadow-2xl z-[70] p-1.5 space-y-1"
                  >
                    <div className="px-3 py-2 border-b border-slate-900/60 mb-1">
                      <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Connected Profile</span>
                      <span className="text-xs font-bold text-slate-200">Alexander S.</span>
                    </div>

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        setActiveTab("Settings");
                        showToast("Redirected to profile settings", "info");
                      }}
                      className="w-full text-left px-3 py-2 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/10 hover:text-white flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>My Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        setActiveTab("Settings");
                        showToast("Opened Preferences settings panel", "info");
                      }}
                      className="w-full text-left px-3 py-2 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/10 hover:text-white flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5 text-slate-400" />
                      <span>Preferences</span>
                    </button>

                    <button
                      onClick={() => {
                        toggleTheme();
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/10 hover:text-white flex items-center gap-2 transition-all cursor-pointer"
                    >
                      {themeMode === "slate" ? (
                        <>
                          <Moon className="w-3.5 h-3.5 text-slate-400" />
                          <span>Theme: Midnight</span>
                        </>
                      ) : (
                        <>
                          <Sun className="w-3.5 h-3.5 text-slate-400" />
                          <span>Theme: Charcoal</span>
                        </>
                      )}
                    </button>

                    <div className="h-px bg-slate-900 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-[11px] rounded-lg text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Logout Workspace</span>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Main Body with Fixed Sidebar + Scrollable Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT SIDEBAR - Permanent on Desktop, never automatically collapses */}
        <aside className="w-64 border-r border-slate-900/60 bg-[#02050c]/80 p-4 flex flex-col justify-between shrink-0 hidden lg:flex h-full">
          <div className="space-y-5 overflow-y-auto pr-1">
            
            {/* Active breadcrumb context */}
            <div className="px-2.5 py-1.5 rounded-xl bg-slate-950/25 border border-slate-900/40 text-[10px] font-mono text-slate-500 flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-slate-600" />
              <span>Inventix</span>
              <span className="text-slate-700">/</span>
              <span className="text-slate-300 font-semibold">{activeTab}</span>
            </div>

            {/* Sidebar Navigation Options */}
            <div className="space-y-4">
              {sidebarMenu.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="text-[9px] font-mono font-bold text-slate-600 uppercase tracking-widest pl-2 block mb-1">
                    {cat.category}
                  </span>
                  {cat.items.map((item, itemIdx) => {
                    const IconComp = item.icon;
                    const isActive = activeTab === item.name;
                    return (
                      <button
                        key={itemIdx}
                        onClick={() => {
                          setActiveTab(item.name);
                          window.scrollTo(0, 0);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-left cursor-pointer sidebar-item-transition sidebar-item-hover ${
                          isActive 
                            ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/10 font-bold active-sidebar-item shadow-sm shadow-indigo-500/5" 
                            : "text-slate-400 border border-transparent"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <IconComp className={`w-3.5 h-3.5 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
                          <span>{item.name}</span>
                        </span>
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

          </div>

          {/* Sourcing profile identifier */}
          <div className="p-3 rounded-xl border border-slate-900 bg-slate-950/20 flex items-center gap-3 shrink-0">
            <div className="w-8.5 h-8.5 rounded-xl bg-indigo-600/15 border border-indigo-500/25 flex items-center justify-center text-xs font-bold text-indigo-400 uppercase">
              AS
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-slate-200 block truncate">Alexander S.</span>
              <span className="text-[10px] text-slate-500 block">Lead Admin</span>
            </div>
          </div>
        </aside>

        {/* MOBILE DRAWER MENU OVERLAY */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            {/* Sidebar drawer body */}
            <div className="relative w-64 bg-[#02050c] h-full p-4 border-r border-slate-900 flex flex-col justify-between z-10 animate-slideInLeft">
              
              <div className="space-y-5 overflow-y-auto">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">ERP Workspace Navigation</span>
                  <button 
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="p-1 rounded-lg border border-slate-900 text-slate-500 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {sidebarMenu.map((cat, idx) => (
                    <div key={idx} className="space-y-1">
                      <span className="text-[9px] font-mono font-bold text-slate-600 uppercase tracking-widest pl-2 block mb-1">
                        {cat.category}
                      </span>
                      {cat.items.map((item, itemIdx) => {
                        const IconComp = item.icon;
                        const isActive = activeTab === item.name;
                        return (
                          <button
                            key={itemIdx}
                            onClick={() => {
                              setActiveTab(item.name);
                              setIsMobileSidebarOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left ${
                              isActive 
                                ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/10 font-bold" 
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <IconComp className="w-3.5 h-3.5" />
                              <span>{item.name}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom identifier for Mobile */}
              <div className="p-3 rounded-xl border border-slate-900 bg-slate-950/20 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/10 flex items-center justify-center text-xs font-bold text-indigo-400">
                  AS
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Alexander S.</span>
                  <span className="text-[10px] text-slate-500 block">Lead Admin</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SCROLLABLE MAIN ERP CONTENT VIEWPORT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 h-full">
          <AnimatePresence mode="wait">
            {isTabLoading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <SkeletonLoader tab={activeTab} />
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {renderActiveSection()}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

      </div>

      {/* GLOBAL DIALOG MODAL SYSTEM */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" 
              onClick={() => setActiveModal(null)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="relative w-full max-w-lg bg-[#040815] border border-slate-900 rounded-2xl shadow-2xl p-6 overflow-hidden"
            >
            
            {/* Modal close icon button */}
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute right-4 top-4 p-1.5 rounded-lg border border-slate-900 bg-slate-950/40 text-slate-500 hover:text-white hover:border-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal: Add Product */}
            {activeModal === "addProduct" && (
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-900">
                  <Package className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">Register Product SKU</h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-semibold uppercase tracking-wider block">Product Description Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Copper Tubing (Grade-X)"
                      value={newProduct.name}
                      onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2.5 text-slate-200 placeholder:text-slate-700 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-semibold uppercase tracking-wider block">Custom Sourcing SKU</label>
                      <input 
                        type="text" 
                        placeholder="e.g. COP-TUB-X500" 
                        value={newProduct.sku}
                        onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2.5 text-slate-200 placeholder:text-slate-700 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-semibold uppercase tracking-wider block">Material Category Sector</label>
                      <select 
                        value={newProduct.sector}
                        onChange={e => setNewProduct({ ...newProduct, sector: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="Bulk Materials">Bulk Materials</option>
                        <option value="Semiconductors">Semiconductors</option>
                        <option value="Energy Cells">Energy Cells</option>
                        <option value="Plastics">Plastics</option>
                        <option value="Components">Components</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-semibold uppercase tracking-wider block">Initial Quantity Registered</label>
                      <input 
                        type="number" 
                        value={newProduct.qty}
                        onChange={e => setNewProduct({ ...newProduct, qty: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-semibold uppercase tracking-wider block">Destination Warehouse Hub</label>
                      <select 
                        value={newProduct.warehouse}
                        onChange={e => setNewProduct({ ...newProduct, warehouse: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="Chicago Warehouse">Chicago Warehouse</option>
                        <option value="Rotterdam Warehouse">Rotterdam Warehouse</option>
                        <option value="Singapore Warehouse">Singapore Warehouse</option>
                        <option value="Bangalore Warehouse">Bangalore Warehouse</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 text-xs">
                  <button 
                    type="button" 
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 rounded-xl border border-slate-900 bg-transparent hover:bg-slate-900 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors cursor-pointer"
                  >
                    Register Product
                  </button>
                </div>
              </form>
            )}

            {/* Modal: Add Vendor */}
            {activeModal === "addVendor" && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-900">
                  <Users className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">Register Corporate Supplier</h3>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-semibold uppercase tracking-wider block">Vendor Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Apex Sourcing Co."
                      value={newVendor.name}
                      onChange={e => setNewVendor({ ...newVendor, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2.5 text-slate-200 placeholder:text-slate-700 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-semibold uppercase tracking-wider block">Material Category</label>
                      <select 
                        value={newVendor.category}
                        onChange={e => setNewVendor({ ...newVendor, category: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="Metals">Metals</option>
                        <option value="Semiconductors">Semiconductors</option>
                        <option value="Plastics">Plastics</option>
                        <option value="Energy Cells">Energy Cells</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-semibold uppercase tracking-wider block">SLA Compliance Target</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 95.0%" 
                        value={newVendor.onTime}
                        onChange={e => setNewVendor({ ...newVendor, onTime: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
                <div className="pt-2 flex items-center justify-end gap-2">
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 rounded-xl border border-slate-900 text-slate-400 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      if (!newVendor.name) return;
                      showToast(`Vendor ${newVendor.name} registered on approved panel!`, "success");
                      
                      const log: LogActivity = {
                        id: Date.now(),
                        action: `Supplier ${newVendor.name} enrolled`,
                        type: "info",
                        timestamp: "Just now",
                        details: `Registered as approved supplier for ${newVendor.category} with ${newVendor.onTime} SLA compliance.`
                      };
                      setRecentActivities([log, ...recentActivities]);
                      setActiveModal(null);
                      setNewVendor({ name: "", category: "Metals", onTime: "95.0%", status: "Approved" });
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold cursor-pointer"
                  >
                    Register Vendor
                  </button>
                </div>
              </div>
            )}

            {/* Modal: Add Warehouse */}
            {activeModal === "addWarehouse" && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-900">
                  <Warehouse className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">Add Physical Warehouse Facility</h3>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-semibold uppercase tracking-wider block">Warehouse Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Frankfurt Storage Hub"
                      value={newWarehouse.name}
                      onChange={e => setNewWarehouse({ ...newWarehouse, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2.5 text-slate-200 placeholder:text-slate-700 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-semibold uppercase tracking-wider block">Geographic Territory</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Germany" 
                        value={newWarehouse.location}
                        onChange={e => setNewWarehouse({ ...newWarehouse, location: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-semibold uppercase tracking-wider block">Total Sq Ft (Capacity)</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 100000" 
                        value={newWarehouse.capacity}
                        onChange={e => setNewWarehouse({ ...newWarehouse, capacity: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
                <div className="pt-2 flex items-center justify-end gap-2">
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 rounded-xl border border-slate-900 text-slate-400 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      if (!newWarehouse.name) return;
                      showToast(`Warehouse facility ${newWarehouse.name} established!`, "success");
                      
                      const log: LogActivity = {
                        id: Date.now(),
                        action: `Warehouse ${newWarehouse.name} activated`,
                        type: "success",
                        timestamp: "Just now",
                        details: `Added new physical storage partition in ${newWarehouse.location} capacity limit verified.`
                      };
                      setRecentActivities([log, ...recentActivities]);
                      setActiveModal(null);
                      setNewWarehouse({ name: "", location: "Texas Hub", capacity: 80 });
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold cursor-pointer"
                  >
                    Confirm Storage Hub
                  </button>
                </div>
              </div>
            )}

            {/* Modal: Create Purchase Request */}
            {activeModal === "createRequest" && (
              <form onSubmit={handleAddRequest} className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-900">
                  <ShoppingBag className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">Create Purchase Requisition Slip</h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-semibold uppercase tracking-wider block">Requested Material / Item</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Copper Tubing Grade-X"
                      value={newRequest.item}
                      onChange={e => setNewRequest({ ...newRequest, item: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2.5 text-slate-200 placeholder:text-slate-700 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-semibold uppercase tracking-wider block">Target Supplier</label>
                      <select 
                        value={newRequest.supplier}
                        onChange={e => setNewRequest({ ...newRequest, supplier: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="Global Plastics Corp">Global Plastics Corp</option>
                        <option value="Intel Sourcing">Intel Sourcing</option>
                        <option value="SteelWorks Ltd">SteelWorks Ltd</option>
                        <option value="Belgrave Chemicals">Belgrave Chemicals</option>
                        <option value="Valves & Fittings Inc">Valves & Fittings Inc</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-semibold uppercase tracking-wider block">Requisition Priority</label>
                      <select 
                        value={newRequest.priority}
                        onChange={e => setNewRequest({ ...newRequest, priority: e.target.value as any })}
                        className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-semibold uppercase tracking-wider block">Requisition Budget Amount ($)</label>
                      <input 
                        type="number" 
                        value={newRequest.amount}
                        onChange={e => setNewRequest({ ...newRequest, amount: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-semibold uppercase tracking-wider block">Department Name</label>
                      <select 
                        value={newRequest.department}
                        onChange={e => setNewRequest({ ...newRequest, department: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="Procurement">Procurement</option>
                        <option value="Operations">Operations</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Logistics">Logistics</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-semibold uppercase tracking-wider block">Expected Delivery Target</label>
                    <input 
                      type="date" 
                      value={newRequest.expectedDelivery}
                      onChange={e => setNewRequest({ ...newRequest, expectedDelivery: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 text-xs">
                  <button 
                    type="button" 
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 rounded-xl border border-slate-900 text-slate-400 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors cursor-pointer"
                  >
                    File Purchase Request
                  </button>
                </div>
              </form>
            )}

            {/* Modal: Receive Stock */}
            {activeModal === "receiveStock" && (
              <form onSubmit={handleReceiveStockSubmit} className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-900">
                  <Truck className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">Receive Stock Inbound Slip</h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-semibold uppercase tracking-wider block">Select Stock Item (SKU)</label>
                    <select 
                      value={receiveProductSku}
                      onChange={e => setReceiveProductSku(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="">-- Choose Stock Item --</option>
                      {liveStock.map(item => (
                        <option key={item.sku} value={item.sku}>{item.name} ({item.sku})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-semibold uppercase tracking-wider block">Inbound Quantity Received</label>
                    <input 
                      type="number" 
                      value={receiveProductQty}
                      onChange={e => setReceiveProductQty(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 text-xs">
                  <button 
                    type="button" 
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 rounded-xl border border-slate-900 text-slate-400 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors cursor-pointer"
                  >
                    Commit Stock Slip
                  </button>
                </div>
              </form>
            )}

            {/* Modal: Generate Report */}
            {activeModal === "generateReport" && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-900">
                  <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">Generate Operational ERP Report</h3>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-semibold uppercase tracking-wider block">Select Report Type</label>
                    <select 
                      value={reportType}
                      onChange={e => setReportType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="Inventory Value Summary">Inventory Value Summary (CSV/PDF)</option>
                      <option value="Vendor SLA Compliance Log">Vendor SLA Compliance Log</option>
                      <option value="Active Purchase Orders Audit">Active Purchase Orders Audit</option>
                      <option value="Warehouse Space Allocation Report">Warehouse Space Allocation Report</option>
                    </select>
                  </div>
                </div>
                <div className="pt-2 flex items-center justify-end gap-2">
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 rounded-xl border border-slate-900 text-slate-400 cursor-pointer"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => {
                      showToast(`Successfully compiled and downloaded "${reportType}"!`, "success");
                      
                      const log: LogActivity = {
                        id: Date.now(),
                        action: `ERP Report Compiled`,
                        type: "success",
                        timestamp: "Just now",
                        details: `Generated analytical worksheet for ${reportType}. Download ready.`
                      };
                      setRecentActivities([log, ...recentActivities]);
                      setActiveModal(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold cursor-pointer"
                  >
                    Compile & Export Data
                  </button>
                </div>
              </div>
            )}

          </motion.div>
        </div>
      )}
      </AnimatePresence>

    </div>
  );
}
