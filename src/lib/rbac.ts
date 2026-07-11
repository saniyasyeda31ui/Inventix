export type AppRole = 
  | 'admin'
  | 'procurement_manager'
  | 'inventory_manager'
  | 'warehouse_manager'
  | 'finance_manager'
  | 'viewer';

export interface Permissions {
  // Modules access (Sidebar & Routes)
  canAccessVendors: boolean;
  canAccessPurchaseRequests: boolean;
  canAccessPurchaseOrders: boolean;
  canAccessProducts: boolean;
  canAccessWarehouses: boolean;
  canAccessInventory: boolean;
  canAccessPayments: boolean;
  canAccessEmployees: boolean;
  canAccessReports: boolean;
  canAccessAIInsights: boolean;

  // Specific Action Permissions
  canManageVendors: boolean;           // Add, Edit, Delete Vendors
  canManagePurchaseRequests: boolean;  // Add, Edit, Delete, Approve PRs
  canManagePurchaseOrders: boolean;    // Add, Edit, Delete, Dispatch, Receive POs
  canManageProducts: boolean;          // Add, Edit, Delete Products
  canManageWarehouses: boolean;        // Add, Edit, Delete Warehouses
  canManageInventory: boolean;         // Adjust stock, receive, audit
  canManagePayments: boolean;          // Make payments, update status
  canManageEmployees: boolean;         // Add, Edit, Delete Employees
}

const defaultPermissions: Permissions = {
  canAccessVendors: false,
  canAccessPurchaseRequests: false,
  canAccessPurchaseOrders: false,
  canAccessProducts: false,
  canAccessWarehouses: false,
  canAccessInventory: false,
  canAccessPayments: false,
  canAccessEmployees: false,
  canAccessReports: false,
  canAccessAIInsights: false,

  canManageVendors: false,
  canManagePurchaseRequests: false,
  canManagePurchaseOrders: false,
  canManageProducts: false,
  canManageWarehouses: false,
  canManageInventory: false,
  canManagePayments: false,
  canManageEmployees: false,
};

export const rolePermissions: Record<AppRole, Permissions> = {
  admin: {
    canAccessVendors: true,
    canAccessPurchaseRequests: true,
    canAccessPurchaseOrders: true,
    canAccessProducts: true,
    canAccessWarehouses: true,
    canAccessInventory: true,
    canAccessPayments: true,
    canAccessEmployees: true,
    canAccessReports: true,
    canAccessAIInsights: true,

    canManageVendors: true,
    canManagePurchaseRequests: true,
    canManagePurchaseOrders: true,
    canManageProducts: true,
    canManageWarehouses: true,
    canManageInventory: true,
    canManagePayments: true,
    canManageEmployees: true,
  },
  procurement_manager: {
    ...defaultPermissions,
    canAccessVendors: true,
    canAccessPurchaseRequests: true,
    canAccessPurchaseOrders: true,
    canAccessReports: true,
    canAccessAIInsights: true,
    canAccessInventory: true,
    canAccessProducts: true,
    canAccessWarehouses: true,
    
    canManageVendors: true,
    canManagePurchaseRequests: true,
    canManagePurchaseOrders: true,
    canManageInventory: true,
  },
  inventory_manager: {
    ...defaultPermissions,
    canAccessProducts: true,
    canAccessWarehouses: true,
    canAccessInventory: true,
    canAccessReports: true,
    canAccessAIInsights: true,

    canManageProducts: true,
    canManageWarehouses: true,
    canManageInventory: true,
  },
  warehouse_manager: {
    ...defaultPermissions,
    canAccessWarehouses: true,
    canAccessInventory: true,
    canAccessReports: true,
    canAccessAIInsights: true,

    canManageWarehouses: false, 
    canManageInventory: true,
  },
  finance_manager: {
    ...defaultPermissions,
    canAccessPayments: true,
    canAccessPurchaseOrders: true,
    canAccessReports: true,

    canManagePayments: true,
  },
  viewer: {
    ...defaultPermissions,
    canAccessReports: true,
    canAccessAIInsights: true,
  }
};

export function mapDatabaseRoleToAppRole(dbRole: string | null | undefined, email?: string | null | undefined): AppRole {
  // The database role now directly matches AppRole
  const validRoles: AppRole[] = [
    'admin',
    'procurement_manager',
    'inventory_manager',
    'warehouse_manager',
    'finance_manager',
    'viewer'
  ];
  
  if (dbRole && validRoles.includes(dbRole as AppRole)) {
    return dbRole as AppRole;
  }
  
  // Fallbacks for legacy rows if not fully migrated
  if (dbRole === 'sourcing_admin') return 'procurement_manager';
  if (dbRole === 'manager') return 'admin';
  
  return 'viewer';
}
