import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { AppRole } from '../lib/rbac';

export interface ChartDataPoint {
  month: string;
  spend?: string;
  spendValue?: number;
  val?: string;
  cx?: number;
  cy?: number;
  x?: number;
  y?: number;
  height?: number;
}

export interface DashboardMetrics {
  // Inventory
  totalInventoryValue: number;
  lowStockCount: number;
  overstockCount: number;
  inventoryAccuracy: string;
  
  // Procurement
  pendingPRCount: number;
  activePOCount: number;
  activeVendorsCount: number;
  monthlyProcurementSpend: number;
  
  // Warehouse
  warehouseCapacity: number;
  warehouseUtilization: string;
  shipmentsToday: number;
  receivingToday: number;

  // Finance
  outstandingPaymentsTotal: number;
  paidThisMonth: number;
  overdueInvoices: number;

  // Admin
  activeEmployeesCount: number;
  totalWarehousesCount: number;

  // Shared
  spendData: ChartDataPoint[];
  valuationData: ChartDataPoint[];
  recentActivities: any[];
  activeAlerts: any[];
}

export function useDashboardMetrics(role: AppRole) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const m: DashboardMetrics = {
        totalInventoryValue: 0,
        lowStockCount: 0,
        overstockCount: 0,
        inventoryAccuracy: '99.9%',
        pendingPRCount: 0,
        activePOCount: 0,
        activeVendorsCount: 0,
        monthlyProcurementSpend: 0,
        warehouseCapacity: 0,
        warehouseUtilization: '0%',
        shipmentsToday: 0,
        receivingToday: 0,
        outstandingPaymentsTotal: 0,
        paidThisMonth: 0,
        overdueInvoices: 0,
        activeEmployeesCount: 0,
        totalWarehousesCount: 0,
        spendData: [],
        valuationData: [],
        recentActivities: [],
        activeAlerts: []
      };

      const isAdmin = role === 'admin';
      const isViewer = role === 'viewer';
      const isProcurement = isAdmin || isViewer || role === 'procurement_manager';
      const isInventory = isAdmin || isViewer || role === 'inventory_manager';
      const isWarehouse = isAdmin || isViewer || role === 'warehouse_manager';
      const isFinance = isAdmin || isViewer || role === 'finance_manager';

      if (isAdmin) {
        const { count: empCount } = await supabase.from('employees').select('*', { count: 'exact', head: true }).eq('status', 'Active');
        m.activeEmployeesCount = empCount || 0;
        const { count: whCount } = await supabase.from('warehouses').select('*', { count: 'exact', head: true });
        m.totalWarehousesCount = whCount || 0;
      }

      // 1. Inventory
      if (isInventory) {
        const { data: invData, error: invError } = await supabase
          .from('inventory_balances')
          .select(`on_hand_qty, safety_stock_qty, products ( unit_price )`);
        if (!invError && invData) {
          invData.forEach((row: any) => {
            const qty = Number(row.on_hand_qty) || 0;
            const price = Number(row.products?.unit_price) || 0;
            m.totalInventoryValue += qty * price;
            if (qty <= (Number(row.safety_stock_qty) || 0)) m.lowStockCount++;
            if (qty > (Number(row.safety_stock_qty) || 0) * 3) m.overstockCount++; // Mock overstock logic
          });
        }
      }

      // 2. Procurement
      if (isProcurement) {
        const { count: prCount } = await supabase.from('purchase_requests').select('*', { count: 'exact', head: true }).eq('status', 'Pending');
        m.pendingPRCount = prCount || 0;

        const { count: poCount } = await supabase.from('purchase_orders').select('*', { count: 'exact', head: true }).not('status', 'in', '("Completed","Cancelled")');
        m.activePOCount = poCount || 0;

        const { count: vendorCount } = await supabase.from('vendors').select('*', { count: 'exact', head: true }).eq('status', 'Active');
        m.activeVendorsCount = vendorCount || 0;
        
        // Month Spend logic reused for monthlyProcurementSpend
        const { data: allPoData } = await supabase.from('purchase_orders').select('total_amount, promised_date');
        const monthlySpend: Record<string, number> = {};
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let currentMonthSpend = 0;
        const currentMonthName = `${monthNames[new Date().getMonth()]} ${new Date().getFullYear()}`;

        allPoData?.forEach(po => {
          if (po.promised_date) {
            const d = new Date(po.promised_date);
            const mKey = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
            monthlySpend[mKey] = (monthlySpend[mKey] || 0) + Number(po.total_amount);
            if (mKey === currentMonthName) currentMonthSpend += Number(po.total_amount);
          }
        });
        m.monthlyProcurementSpend = currentMonthSpend;

        const spendKeys = Object.keys(monthlySpend).slice(-6);
        m.spendData = spendKeys.map((key, index) => {
          const val = monthlySpend[key];
          return {
            month: key.split(' ')[0], 
            spendValue: val,
            spend: `$${val.toLocaleString()}`,
            x: 75 + (index * 70),
            y: 100, 
            height: 100 
          };
        });
        if (m.spendData.length === 0) {
          m.spendData.push({ month: "No Data", spendValue: 0, spend: "$0", x: 75, y: 100, height: 10 });
        }
      }

      // 3. Finance
      if (isFinance) {
        const { data: payData } = await supabase.from('payments').select('amount_paid, status');
        if (payData) {
          payData.forEach(p => {
            if (p.status === 'Pending' || p.status === 'Processing') m.outstandingPaymentsTotal += Number(p.amount_paid) || 0;
            if (p.status === 'Overdue') m.overdueInvoices++;
            if (p.status === 'Paid') m.paidThisMonth += Number(p.amount_paid) || 0; // Simplified for mock
          });
        }
      }

      // 4. Warehouse (Mock Data for KPIs)
      if (isWarehouse) {
        const { data: whData } = await supabase.from('warehouses').select('capacity, utilization');
        if (whData) {
          let cap = 0;
          let util = 0;
          whData.forEach(w => {
            cap += Number(w.capacity) || 0;
            util += Number(w.utilization) || 0;
          });
          m.warehouseCapacity = cap;
          m.warehouseUtilization = whData.length ? `${Math.round(util / whData.length)}%` : '0%';
        }
        m.shipmentsToday = 12; // Mock
        m.receivingToday = 5; // Mock
      }

      // 5. Recent Activities & Alerts
      const { data: actData } = await supabase.from('activity_logs').select('*').order('timestamp', { ascending: false }).limit(5);
      m.recentActivities = actData || [];

      // Filter alerts based on role
      const { data: alertData } = await supabase.from('ai_recommendations').select('*').eq('status', 'Active').limit(4);
      if (alertData) {
        let filteredAlerts = alertData;
        // Basic naive filtering for alerts
        if (role === 'inventory_manager') filteredAlerts = alertData.filter(a => a.alert_message.includes('stock') || a.alert_message.includes('demand'));
        if (role === 'procurement_manager') filteredAlerts = alertData.filter(a => a.alert_message.includes('order') || a.alert_message.includes('supplier'));
        
        m.activeAlerts = filteredAlerts.map(a => ({
          id: a.id,
          message: a.alert_message,
          type: a.severity === 'high' ? 'warning' : 'info'
        }));
      }

      setMetrics(m);

    } catch (err) {
      console.error("[useDashboardMetrics] Error:", err);
      setError("Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return { metrics, loading, error, refreshMetrics: fetchMetrics };
}
