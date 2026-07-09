import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Warehouse, Package, Users, Receipt,
  BarChart2, Bell, LogOut, ArrowUpRight,
  Settings, AlertTriangle, DollarSign, Activity, FileText,
  Search, Plus, CheckCircle, Clock, XCircle, AlertCircle, Filter, ShieldAlert,
  ChevronLeft, ChevronRight, Info, Sparkles, TrendingUp, Sun, Moon,
  X, Check, FileSpreadsheet, Building2, CreditCard, Layers,
  ShoppingBag, Truck, Calendar, Sliders, Menu, Cpu
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

  // Theme state (Now hardcoded to light-premium in styling, keeping state for component signature compatibility if needed)
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
    // In this premium light theme, toggle might just refresh animations or we can remove the logic.
    // Preserving the function signature.
    showToast("Premium light theme is locked for optimal workspace visibility.", "info");
  };

  const renderAccessDenied = () => (
    <div className="p-12 text-center border border-white/50 rounded-3xl bg-white/40 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-4 flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center border border-rose-100 shadow-sm mb-2">
        <AlertTriangle className="w-8 h-8 text-rose-500" />
      </div>
      <h3 className="text-xl font-bold text-slate-900">Access Denied</h3>
      <p className="text-sm text-slate-500 max-w-md">
        Your current role (<span className="text-indigo-600 capitalize font-semibold">{role?.replace('_', ' ')}</span>) does not have permission to view the {activeTab} module.
      </p>
      <button
        onClick={() => setActiveTab("Overview")}
        className="mt-4 px-6 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md"
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
          <div className="p-8 text-center border border-white/50 rounded-3xl bg-white/40 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-3">
            <h3 className="text-sm font-bold text-slate-800">Section Under Development</h3>
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
    <div className="relative w-screen h-screen overflow-hidden font-sans flex bg-[#f6ebff]">

      {/* ======================================================== */}
      {/* PREMIUM BACKGROUND (The Living Gradient Canvas) */}
      {/* ======================================================== */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Core base gradients replicating the pink/purple/blue wash */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_#fbcfe8_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#bfdbfe_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#e9d5ff_0%,_transparent_80%)]" />

        {/* Abstract glowing waves/meshes */}
        <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }} transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }} className="absolute -left-[20%] top-[20%] w-[60vw] h-[60vw] bg-pink-300/40 rounded-full blur-[140px]" />
        <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} className="absolute -right-[20%] bottom-[10%] w-[60vw] h-[60vw] bg-blue-300/40 rounded-full blur-[140px]" />

        {/* Wave lines SVG mimicking the background energy */}
        <div className="absolute inset-0 opacity-[0.15]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,300 C300,400 600,100 1000,200 C1400,300 1800,100 2000,300" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="5,5" />
            <path d="M0,500 C400,600 800,200 1200,400 C1600,600 1900,300 2000,500" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="10,10" />
            <path d="M0,700 C500,800 1000,400 1500,600 C1800,700 1950,500 2000,700" fill="none" stroke="#fff" strokeWidth="4" />
          </svg>
        </div>

        {/* Floating 3D Bubbles */}
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-gradient-to-br from-pink-300/40 to-transparent border-[3px] border-white/40 shadow-[inset_20px_20px_40px_rgba(255,255,255,0.8),inset_-10px_-10px_30px_rgba(255,100,255,0.3),0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-sm" />
        <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-10 right-20 w-32 h-32 rounded-full bg-gradient-to-br from-blue-200/40 to-transparent border-[2px] border-white/50 shadow-[inset_10px_10px_20px_rgba(255,255,255,0.8),inset_-5px_-5px_15px_rgba(100,200,255,0.3),0_10px_30px_rgba(0,0,0,0.1)] backdrop-blur-[2px]" />
        <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute top-[45%] right-10 w-24 h-24 rounded-full bg-gradient-to-br from-cyan-200/30 to-transparent border border-white/60 shadow-[inset_8px_8px_15px_rgba(255,255,255,0.9),inset_-4px_-4px_10px_rgba(100,255,255,0.4),0_10px_25px_rgba(0,0,0,0.1)] backdrop-blur-[1px]" />
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[20%] left-10 w-12 h-12 rounded-full bg-gradient-to-br from-white/40 to-transparent border border-white/60 shadow-[inset_4px_4px_8px_rgba(255,255,255,0.9)] backdrop-blur-sm" />

        {/* Animated mesh grid & tiny stars */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#ffffff_1.5px,_transparent_1.5px)] opacity-[0.5]" style={{ backgroundSize: '70px 70px' }} />

        {/* Sparkles */}
        <div className="absolute top-[15%] left-[30%] w-2 h-2 bg-white rounded-full shadow-[0_0_10px_4px_rgba(255,255,255,1)]" />
        <div className="absolute top-[10%] right-[40%] w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_3px_rgba(255,255,255,0.8)]" />
        <div className="absolute bottom-[20%] left-[45%] w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_12px_5px_rgba(255,255,255,1)]" />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col overflow-hidden">

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
                className="pointer-events-auto bg-white/80 backdrop-blur-xl border border-white rounded-2xl p-3.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1),inset_0_0_20px_rgba(255,255,255,0.8)] flex items-center gap-3 w-80 relative overflow-hidden"
              >
                {/* Progress countdown indicator line */}
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 4, ease: "linear" }}
                  className={`absolute bottom-0 left-0 h-0.5 ${toast.type === "success" ? "bg-emerald-500" :
                    toast.type === "error" ? "bg-rose-500" :
                      toast.type === "warning" ? "bg-amber-500" : "bg-indigo-500"
                    }`}
                />

                {/* Toast Type Icons */}
                {toast.type === "success" && <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />}
                {toast.type === "error" && <XCircle className="w-5 h-5 text-rose-500 shrink-0" />}
                {toast.type === "warning" && <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />}
                {toast.type === "info" && <Info className="w-5 h-5 text-indigo-500 shrink-0" />}

                {/* Message */}
                <div className="flex-1 text-xs font-bold text-slate-800 pr-3 leading-tight">{toast.message}</div>

                {/* Close Icon */}
                <button
                  onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                  className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer bg-slate-100 hover:bg-slate-200 rounded-full"
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
                animate={{ opacity: 0.2 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowNotifications(false)}
                className="fixed inset-0 bg-slate-900 z-[110] cursor-pointer"
              />

              {/* Slide-out Drawer Panel */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 w-full sm:w-[400px] h-full bg-white/70 backdrop-blur-3xl border-l border-white/60 z-[120] p-6 shadow-[-20px_0_40px_-10px_rgba(0,0,0,0.05)] flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-white/40">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100 text-indigo-600 shadow-sm">
                        <Bell className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-extrabold text-slate-900 uppercase tracking-widest font-mono">Alerts Feed</span>
                    </div>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white/50 hover:bg-white text-slate-500 hover:text-slate-800 cursor-pointer shadow-sm transition-all"
                    >
                      <X className="w-4.5 h-4.5" />
                    </button>
                  </div>

                  {/* Filters Tab Bar */}
                  <div className="flex gap-2 p-1.5 rounded-[14px] bg-white/50 border border-white shadow-sm">
                    <button
                      onClick={() => setNotiFilter("all")}
                      className={`flex-1 text-center py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${notiFilter === "all" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                      All ({notifications.length})
                    </button>
                    <button
                      onClick={() => setNotiFilter("unread")}
                      className={`flex-1 text-center py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${notiFilter === "unread" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
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
                        <div key={`noti-skeleton-${i}`} className="p-4 rounded-[16px] bg-white/40 border border-white space-y-3 animate-pulse shadow-sm">
                          <div className="flex items-center justify-between">
                            <div className="h-3 w-32 rounded bg-slate-200" />
                            <div className="h-2.5 w-10 rounded bg-slate-200" />
                          </div>
                          <div className="h-2.5 w-full rounded bg-slate-200" />
                          <div className="h-2.5 w-3/4 rounded bg-slate-200" />
                        </div>
                      ))
                    ) : notiError ? (
                      // Error state
                      <div className="py-8 text-center space-y-2">
                        <p className="text-xs text-rose-500 font-bold">Failed to load notifications</p>
                        <p className="text-[10px] text-slate-500">{notiError}</p>
                        <button
                          onClick={refreshNotifications}
                          className="text-[11px] font-bold text-indigo-500 hover:text-indigo-600 cursor-pointer bg-indigo-50 px-3 py-1.5 rounded-lg mt-2"
                        >
                          Retry Connection
                        </button>
                      </div>
                    ) : notifications.filter(n => notiFilter === "all" || !n.read).length > 0 ? (
                      notifications.filter(n => notiFilter === "all" || !n.read).map(n => (
                        <div
                          key={n.id}
                          className={`p-4 rounded-[16px] text-left transition-all border shadow-sm ${n.read
                            ? "bg-white/40 border-white/60 text-slate-600"
                            : "bg-white border-white shadow-[0_4px_15px_rgba(0,0,0,0.03)] border-l-[3px] border-l-indigo-500"
                            }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`font-extrabold text-[12px] ${n.read ? 'text-slate-600' : 'text-slate-900'}`}>{n.title}</span>
                            <span className="text-[10px] font-bold text-slate-400">{n.time_label}</span>
                          </div>
                          <p className={`text-[11px] leading-relaxed ${n.read ? 'text-slate-500' : 'text-slate-600'}`}>{n.description}</p>

                          {!n.read && (
                            <button
                              onClick={() => {
                                markAsRead(n.id);
                                showToast(`Marked "${n.title}" as read`, "success");
                              }}
                              className="text-[10px] font-bold text-indigo-500 hover:text-indigo-600 mt-3 block cursor-pointer bg-indigo-50/50 hover:bg-indigo-50 px-2 py-1 rounded-md transition-colors"
                            >
                              Mark as Read
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="py-12 text-center text-slate-500 text-xs font-medium">
                        No notifications found. You're all caught up!
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-5 border-t border-white/40 flex items-center justify-between gap-4">
                  <button
                    onClick={async () => {
                      await markAllAsRead();
                      showToast("All notifications marked as read.", "success");
                    }}
                    className="text-[11px] font-bold text-slate-500 hover:text-slate-800 cursor-pointer px-3 py-2 rounded-xl hover:bg-white/50"
                  >
                    Mark all read
                  </button>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 rounded-xl text-[12px] font-bold text-white cursor-pointer shadow-lg shadow-slate-900/20 transition-all"
                  >
                    Close Panel
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Top Fixed Header / Navbar */}
        <header className="bg-white/40 backdrop-blur-3xl border-b border-white/40 shrink-0 px-6 py-3 flex items-center justify-between z-50 h-[68px] shadow-[0_4px_30px_rgba(0,0,0,0.02)] relative">
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />

          {/* Brand */}
          <div className="flex items-center gap-4">
            {/* Mobile Hamburg menu */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 -ml-2 rounded-xl border border-white bg-white/60 text-slate-600 hover:text-slate-900 lg:hidden cursor-pointer shadow-sm"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Elevated Brand Anchor */}
            <div className="flex items-center gap-3.5 p-1.5 pr-4 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_2px_10px_rgba(0,0,0,0.02),inset_0_1px_0_rgba(255,255,255,0.8)] relative group cursor-pointer transition-all hover:bg-white/60">

              {/* Premium Logo Container */}
              <div className="relative">
                {/* Soft ambient glow behind logo */}
                <div className="absolute inset-0 bg-indigo-500/40 blur-xl rounded-full scale-110 opacity-70 group-hover:opacity-100 transition-opacity" />

                {/* High-Contrast Logo Box */}
                <div className="relative w-[42px] h-[42px] rounded-[14px] bg-gradient-to-tr from-[#6D4CFF] to-[#8B5CF6] flex items-center justify-center shadow-[0_8px_16px_-4px_rgba(109,76,255,0.4),inset_0_2px_4px_rgba(255,255,255,0.3)] overflow-hidden border border-indigo-400/20">
                  <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0)_100%)] w-[200%] -left-[100%] group-hover:animate-[shimmer_2s_infinite]" />
                  <Cpu className="w-[22px] h-[22px] text-white drop-shadow-md relative z-10" strokeWidth={2.5} />
                </div>
              </div>

              {/* Typography Hierarchy */}
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2.5">
                  {/* Primary Anchor */}
                  <span className="font-display font-black text-[19px] text-slate-900 leading-none tracking-tight drop-shadow-sm">
                    Inventix
                  </span>
                  {/* Premium Glass Badge */}
                  <div className="px-2 py-0.5 text-[9px] font-extrabold rounded-lg bg-indigo-50/80 backdrop-blur-sm text-indigo-700 border border-indigo-200/60 uppercase tracking-widest shadow-[0_2px_4px_rgba(99,102,241,0.05),inset_0_1px_1px_rgba(255,255,255,1)]">
                    ERP v2.6
                  </div>
                </div>
                {/* Secondary Anchor */}
                <p className="text-[10px] text-slate-500/90 font-bold mt-1 tracking-wide">
                  {profile?.organization || 'Acme Sourcing Hub'}
                </p>
              </div>
            </div>
          </div>

          {/* Global Real-time Clock */}
          <div className="hidden md:flex items-center gap-5 text-xs font-bold">
            <div className="flex items-center gap-2 text-slate-600 bg-white/50 px-3 py-1.5 rounded-lg border border-white shadow-sm">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>{currentTime || "00:00:00"}</span>
            </div>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600 tracking-wide">{currentDate || "Loading ERP Node..."}</span>
          </div>

          {/* Actions & Profile Dropdown */}
          <div className="flex items-center gap-4">

            {/* Notifications Trigger Bell */}
            <button
              onClick={() => {
                setShowNotifications(true);
                setNotiFilter("all");
                refreshNotifications();
              }}
              className="p-2.5 rounded-xl border border-white bg-white/60 hover:bg-white transition-all text-slate-600 hover:text-indigo-600 relative cursor-pointer shadow-sm"
              title="Sourcing Alerts Feed"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-white animate-pulse" />
              )}
            </button>

            <div className="h-8 w-[2px] bg-white/50 hidden sm:block mx-1" />

            {/* User Profile Area with Animated Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1.5 pr-3 rounded-[16px] border border-white hover:border-indigo-100 bg-white/60 hover:bg-white shadow-sm transition-all text-left cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-50 to-purple-50 border border-indigo-100 flex items-center justify-center text-xs font-extrabold text-indigo-600 uppercase shadow-inner">
                  {profile?.full_name ? profile.full_name.substring(0, 2).toUpperCase() : 'US'}
                </div>
                <div className="hidden md:block pr-1">
                  <div className="text-[12px] font-extrabold text-slate-900 leading-tight">{profile?.full_name || user?.email?.split('@')[0] || 'User'}</div>
                  <p className="text-[10px] text-slate-500 font-bold capitalize">{role?.replace('_', ' ') || 'Viewer'}</p>
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
                      className="absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-2xl border border-white rounded-[20px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] z-[70] p-2 space-y-1"
                    >
                      <div className="px-3 py-3 border-b border-slate-100 mb-2">
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Connected Profile</span>
                        <span className="text-[13px] font-extrabold text-slate-900">Alexander S.</span>
                        <span className="text-[11px] font-medium text-slate-500 block mt-0.5">alexander@acme.com</span>
                      </div>

                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          setActiveTab("Settings");
                          showToast("Redirected to profile settings", "info");
                        }}
                        className="w-full text-left px-3 py-2.5 text-[12px] font-bold rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-3 transition-colors cursor-pointer"
                      >
                        <Users className="w-4 h-4 text-slate-400" />
                        <span>My Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          setActiveTab("Settings");
                          showToast("Opened Preferences settings panel", "info");
                        }}
                        className="w-full text-left px-3 py-2.5 text-[12px] font-bold rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-3 transition-colors cursor-pointer"
                      >
                        <Sliders className="w-4 h-4 text-slate-400" />
                        <span>Preferences</span>
                      </button>

                      <div className="h-px bg-slate-100 my-2" />

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2.5 text-[12px] font-bold rounded-xl text-rose-600 hover:bg-rose-50 flex items-center gap-3 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
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

          {/* LEFT SIDEBAR - Premium Floating Glassmorphism */}
          <aside className="w-[230px] bg-white/40 backdrop-blur-3xl border-r border-white/40 p-5 flex flex-col justify-between shrink-0 hidden lg:flex h-full shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative z-40">
            <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />
            <div className="space-y-8 overflow-y-auto pr-2 pb-4 sidebar-scrollbar relative">

              {/* Active breadcrumb context */}
              <div className="px-3 py-2.5 rounded-[14px] bg-white/60 border border-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-[11px] font-bold text-slate-500 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                <span>{profile?.organization || 'Inventix'}</span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-800 tracking-wide">{activeTab}</span>
              </div>

              {/* Sidebar Navigation Options */}
              <div className="space-y-5">
                {sidebarMenu.map((cat, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest pl-3 block mb-2">
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
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[12px] text-[12px] text-left cursor-pointer transition-all duration-300 relative group overflow-hidden ${isActive
                            ? "bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 shadow-[0_12px_24px_-6px_rgba(99,102,241,0.6),inset_0_1px_1px_rgba(255,255,255,0.2)] text-white font-bold -translate-y-0.5"
                            : "text-slate-600 font-bold border border-transparent hover:bg-white/80 hover:text-indigo-600 hover:shadow-[0_4px_12px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,1)]"
                            }`}
                        >
                          {isActive && <div className="absolute inset-0 bg-white/10 mix-blend-overlay" />}
                          <span className="flex items-center gap-2.5 relative z-10">
                            <IconComp className={`w-4 h-4 transition-all duration-300 ${isActive ? "text-white scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" : "text-slate-400 group-hover:text-indigo-500"}`} />
                            <span className="tracking-wide">{item.name}</span>
                          </span>

                          {/* Active Indicator Dot */}
                          {isActive && (
                            <motion.span
                              layoutId="activeTabIndicator"
                              className="w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(99,102,241,0.8)] relative z-10"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

            </div>

            {/* Sourcing profile identifier - Floating Card */}
            <div className="p-4 rounded-[20px] border border-white/80 bg-white/60 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,1)] flex items-center gap-3 shrink-0 mt-4 relative z-10 transition-transform hover:-translate-y-0.5 duration-300">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20 flex items-center justify-center text-xs font-extrabold text-white uppercase tracking-wider relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-[shimmer_2s_infinite]" />
                {profile?.full_name ? profile.full_name.substring(0, 2).toUpperCase() : 'AS'}
              </div>
              <div className="truncate flex-1">
                <span className="text-[13px] font-bold text-slate-800 block truncate tracking-tight">{profile?.full_name || 'Alexander S.'}</span>
                <span className="text-[11px] font-medium text-slate-500 block capitalize">{profile?.role ? profile.role.replace(/_/g, ' ') : 'Lead Admin'}</span>
              </div>
            </div>
          </aside>

          {/* MOBILE DRAWER MENU OVERLAY */}
          {isMobileSidebarOpen && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                onClick={() => setIsMobileSidebarOpen(false)}
              />
              {/* Sidebar drawer body */}
              <div className="relative w-[280px] bg-white/90 backdrop-blur-2xl h-full p-5 border-r border-white flex flex-col justify-between z-10 shadow-[20px_0_40px_rgba(0,0,0,0.05)]">

                <div className="space-y-6 overflow-y-auto">
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-[11px] font-extrabold text-slate-800 uppercase tracking-widest">Navigation</span>
                    <button
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-5">
                    {sidebarMenu.map((cat, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest pl-3 block mb-2">
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
                              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-[14px] text-[12.5px] text-left transition-all ${isActive
                                ? "bg-white shadow-[0_4px_15px_rgba(0,0,0,0.05)] text-indigo-700 font-extrabold border border-indigo-50"
                                : "text-slate-600 font-semibold hover:bg-slate-50"
                                }`}
                            >
                              <span className="flex items-center gap-3">
                                <IconComp className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
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
                <div className="p-3.5 rounded-[16px] border border-slate-100 bg-slate-50 flex items-center gap-3 shrink-0 mt-4">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xs font-extrabold text-indigo-600">
                    {profile?.full_name ? profile.full_name.substring(0, 2).toUpperCase() : 'AS'}
                  </div>
                  <div>
                    <span className="text-[12px] font-extrabold text-slate-900 block">{profile?.full_name || 'Alexander S.'}</span>
                    <span className="text-[10px] font-bold text-slate-500 block capitalize">{profile?.role ? profile.role.replace(/_/g, ' ') : 'Lead Admin'}</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SCROLLABLE MAIN ERP CONTENT VIEWPORT */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6 h-full">
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
    </div>
  );
}
