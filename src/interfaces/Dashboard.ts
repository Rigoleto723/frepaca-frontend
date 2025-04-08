export interface DashboardData {
    orders: {
        total: number;
        byStatus: {
            pending: number;
            assigned: number;
            dispatched: number;
            delivered: number;
        };
        byRoute: Array<{
            routeId: number;
            routeName: string;
            count: number;
        }>;
    };
    sales: {
        today: number;
        thisMonth: number;
        byProduct: Array<{
            productId: number;
            name: string;
            quantity: number;
            revenue: number;
        }>;
    };
    inventory: {
        lowStock: Array<{
            productId: number;
            name: string;
            currentStock: number;
            minimumStock: number;
        }>;
    };
    delivery: {
        performance: Array<{
            routeId: number;
            routeName: string;
            deliveredOrders: number;
            totalOrders: number;
            revenue: number;
        }>;
    };
} 