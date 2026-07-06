import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Warehouse, Package, Users, Receipt, 
  BarChart2, Bell, LogOut, ArrowUpRight, 
  Settings, AlertTriangle, DollarSign, Activity, FileText,
  Search, Plus, CheckCircle, Clock, XCircle, AlertCircle, Filter, ShieldAlert,
  ChevronLeft, ChevronRight, Info, Sparkles, TrendingUp, Sun, Moon, 
  X, Check, FileSpreadsheet, Building2, CreditCard, Layers,
  ShoppingBag, Truck, Calendar, Sliders, Menu
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import SkeletonLoader from "../components/SkeletonLoader";



// Modular Section Imports
import OverviewSection from "../components/OverviewSection";
import ProductsSection from "../components/ProductsSection";
import WarehousesSection from "../components/WarehousesSection";
import InventorySection from "../components/InventorySection";
import { ErrorBoundary } from "../components/ErrorBoundary";
import VendorsSection from "../components/VendorsSection";
import PurchaseRequestsSection from "../components/PurchaseRequestsSection";
import { usePurchaseRequests } from "../hooks/usePurchaseRequests";
import PurchaseOrdersSection from "../components/PurchaseOrdersSection";
import ReportsSection from "../components/ReportsSection";
import AIInsightsSection from "../components/AIInsightsSection";
import CompanySection from "../components/CompanySection";
import EmployeesSection from "../components/EmployeesSection";
import UserManagementSection from "../components/UserManagementSection";
import PaymentsSection from "../components/PaymentsSection";
import SettingsSection from "../components/SettingsSection";
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, profile, role, permissions, signOut } = useAuth();

  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  
  // Dynamic Active View Tab State
  const [activeTab, setActiveTab] = useState<string>("Overview");

  // Mobile navigation states
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Real-time states
  const { purchaseRequests } = usePurchaseRequests();

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

  const handleLogout = async () => {
    await signOut();
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



  const toggleTheme = () => {
    const newTheme = themeMode === "slate" ? "charcoal" : "slate";
    setThemeMode(newTheme);
    showToast(`Workspace backdrop toggled to ${newTheme === "slate" ? "Slate Midnight" : "Charcoal Black"}.`, "info");
  };

  const renderAccessDenied = () => (
    <div className="p-12 text-center border border-slate-900 rounded-2xl bg-[#040815] space-y-4 flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20 mb-2">
        <AlertTriangle className="w-8 h-8 text-rose-500" />
      </div>
      <h3 className="text-xl font-bold text-slate-200">Access Denied</h3>
      <p className="text-sm text-slate-500 max-w-md">
        Your current role (<span className="text-indigo-400 capitalize">{role?.replace('_', ' ')}</span>) does not have permission to view the {activeTab} module.
      </p>
      <button 
        onClick={() => setActiveTab("Overview")}
        className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors"
      >
        Return to Overview
      </button>
    </div>
  );

  // Render Section dynamically based on active tab
  const renderActiveSection = () => {
    switch (activeTab) {
      case "Overview":
        return (
          <OverviewSection
            onDismissAlert={handleDismissAlert}
            onOpenModal={handleOpenModal}
            onTabChange={(tab) => {
              setActiveTab(tab);
              window.scrollTo(0, 0);
            }}
          />
        );
      case "Products":
        if (!permissions?.canAccessProducts) return renderAccessDenied();
        return <ProductsSection onShowToast={showToast} onOpenModal={handleOpenModal} activeModal={activeModal} onCloseModal={() => setActiveModal(null)} />;
      case "Warehouses":
        if (!permissions?.canAccessWarehouses) return renderAccessDenied();
        return <WarehousesSection onShowToast={showToast} onOpenModal={handleOpenModal} activeModal={activeModal} onCloseModal={() => setActiveModal(null)} />;
      case "Inventory":
        if (!permissions?.canAccessInventory) return renderAccessDenied();
        return (
          <ErrorBoundary>
            <InventorySection onShowToast={showToast} activeModal={activeModal} onCloseModal={() => setActiveModal(null)} />
          </ErrorBoundary>
        );
      case "Vendors":
        if (!permissions?.canAccessVendors) return renderAccessDenied();
        return <VendorsSection onShowToast={showToast} onOpenModal={handleOpenModal} activeModal={activeModal} onCloseModal={() => setActiveModal(null)} />;
      case "Purchase Requests":
        if (!permissions?.canAccessPurchaseRequests) return renderAccessDenied();
        return <PurchaseRequestsSection onShowToast={showToast} onOpenModal={handleOpenModal} activeModal={activeModal} onCloseModal={() => setActiveModal(null)} />;
      case "Purchase Orders":
        if (!permissions?.canAccessPurchaseOrders) return renderAccessDenied();
        return <PurchaseOrdersSection onShowToast={showToast} activeModal={activeModal} onCloseModal={() => setActiveModal(null)} />;
      case "Reports":
        if (!permissions?.canAccessReports) return renderAccessDenied();
        return <ReportsSection onShowToast={showToast} />;
      case "AI Insights":
        if (!permissions?.canAccessAIInsights) return renderAccessDenied();
        return <AIInsightsSection onShowToast={showToast} />;
      case "Company":
        if (!permissions?.canAccessEmployees) return renderAccessDenied();
        return <CompanySection onShowToast={showToast} />;
      case "Employees":
        if (!permissions?.canAccessEmployees) return renderAccessDenied();
        return (
          <ErrorBoundary>
            <EmployeesSection activeModal={activeModal} onCloseModal={() => setActiveModal(null)} onShowToast={showToast} />
          </ErrorBoundary>
        );
      case "User Management":
        if (role !== 'admin') return renderAccessDenied();
        return (
          <ErrorBoundary>
            <UserManagementSection onShowToast={showToast} />
          </ErrorBoundary>
        );
      case "Payments":
        if (!permissions?.canAccessPayments) return renderAccessDenied();
        return (
          <ErrorBoundary>
            <PaymentsSection activeModal={activeModal} onCloseModal={() => setActiveModal(null)} onShowToast={showToast} />
          </ErrorBoundary>
        );
      case "Settings":
        if (!permissions?.canAccessEmployees) return renderAccessDenied();
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
  const baseSidebarMenu = [
    {
      category: "Dashboard",
      items: [
        { name: "Overview", icon: LayoutDashboard } as any
      ]
    },
    {
      category: "Inventory",
      items: [
        { name: "Products", icon: Package, permission: permissions?.canAccessProducts },
        { name: "Warehouses", icon: Warehouse, permission: permissions?.canAccessWarehouses },
        { name: "Inventory", icon: Sliders, permission: permissions?.canAccessInventory }
      ]
    },
    {
      category: "Procurement",
      items: [
        { name: "Vendors", icon: Users, permission: permissions?.canAccessVendors },
        { name: "Purchase Requests", icon: ShoppingBag, permission: permissions?.canAccessPurchaseRequests },
        { name: "Purchase Orders", icon: Receipt, permission: permissions?.canAccessPurchaseOrders }
      ]
    },
    {
      category: "Analytics",
      items: [
        { name: "Reports", icon: FileText, permission: permissions?.canAccessReports },
        { name: "AI Insights", icon: Sparkles, permission: permissions?.canAccessAIInsights }
      ]
    },
    {
      category: "Administration",
      items: [
        { name: "Company", icon: Building2, permission: permissions?.canAccessEmployees }, // Assuming company is grouped with employees
        { name: "Employees", icon: Users, permission: permissions?.canAccessEmployees },
        { name: "User Management", icon: ShieldAlert, permission: role === 'admin' },
        { name: "Payments", icon: CreditCard, permission: permissions?.canAccessPayments },
        { name: "Settings", icon: Settings, permission: permissions?.canAccessEmployees } // Grouping settings with admin privileges
      ]
    }
  ];

  // Filter sidebar based on RBAC permissions
  const sidebarMenu = baseSidebarMenu.map(category => ({
    ...category,
    items: category.items.filter(item => item.permission !== false) // Default to true for Overview
  })).filter(category => category.items.length > 0);


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



    </div>
  );
}
