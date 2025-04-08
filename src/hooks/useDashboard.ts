import { useState, useEffect } from 'react';
import { DashboardData } from '../interfaces/Dashboard';
import client from '../axiosConfig';

export const useDashboard = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Obtener órdenes
            const ordersResponse = await client.get('/api/orders/');
            const orders = ordersResponse.data;

            // Obtener productos
            const productsResponse = await client.get('/api/products/');
            const products = productsResponse.data;

            // Obtener rutas
            const routesResponse = await client.get('/api/routes/');
            const routes = routesResponse.data;

            // Calcular estadísticas de órdenes
            const today = new Date().toISOString().split('T')[0];
            const ordersByStatus = {
                pending: orders.filter((o: any) => o.status === 'pending').length,
                assigned: orders.filter((o: any) => o.status === 'assigned').length,
                dispatched: orders.filter((o: any) => o.status === 'dispatched').length,
                delivered: orders.filter((o: any) => o.status === 'delivered').length
            };

            // Calcular ventas del día
            const todayOrders = orders.filter((o: any) => o.order_date === today);
            const todaySales = todayOrders.reduce((acc: number, order: any) => {
                return acc + order.orderdetail_set.reduce((sum: number, detail: any) => {
                    return sum + (detail.final_price || 0);
                }, 0);
            }, 0);

            // Calcular ventas del mes
            const currentMonth = new Date().getMonth() + 1;
            const currentYear = new Date().getFullYear();
            const monthOrders = orders.filter((o: any) => {
                const orderDate = new Date(o.order_date);
                return orderDate.getMonth() + 1 === currentMonth &&
                    orderDate.getFullYear() === currentYear;
            });
            const monthSales = monthOrders.reduce((acc: number, order: any) => {
                return acc + order.orderdetail_set.reduce((sum: number, detail: any) => {
                    return sum + (detail.final_price || 0);
                }, 0);
            }, 0);

            // Calcular ventas por producto
            const salesByProduct = products.map((product: any) => {
                const productOrders = orders.filter((order: any) =>
                    order.orderdetail_set.some((detail: any) => detail.product_id === product.id)
                );
                const revenue = productOrders.reduce((acc: number, order: any) => {
                    return acc + order.orderdetail_set.reduce((sum: number, detail: any) => {
                        return sum + (detail.product_id === product.id ? (detail.final_price || 0) : 0);
                    }, 0);
                }, 0);
                return {
                    productId: product.id,
                    name: product.name,
                    quantity: productOrders.length,
                    revenue
                };
            });

            // Calcular stock bajo
            const lowStock = products.filter((product: any) =>
                product.current_stock <= product.minimum_stock
            ).map((product: any) => ({
                productId: product.id,
                name: product.name,
                currentStock: product.current_stock,
                minimumStock: product.minimum_stock
            }));

            // Calcular rendimiento por ruta
            const deliveryPerformance = routes.map((route: any) => {
                const routeOrders = orders.filter((order: any) => order.assigned_route_id === route.id);
                const deliveredOrders = routeOrders.filter((order: any) => order.status === 'delivered');
                const revenue = deliveredOrders.reduce((acc: number, order: any) => {
                    return acc + order.orderdetail_set.reduce((sum: number, detail: any) => {
                        return sum + (detail.final_price || 0);
                    }, 0);
                }, 0);
                return {
                    routeId: route.id,
                    routeName: route.name,
                    deliveredOrders: deliveredOrders.length,
                    totalOrders: routeOrders.length,
                    revenue
                };
            });

            // Consolidar todos los datos
            const dashboardData: DashboardData = {
                orders: {
                    total: orders.length,
                    byStatus: ordersByStatus,
                    byRoute: routes.map((route: any) => ({
                        routeId: route.id,
                        routeName: route.name,
                        count: orders.filter((o: any) => o.assigned_route_id === route.id).length
                    }))
                },
                sales: {
                    today: todaySales,
                    thisMonth: monthSales,
                    byProduct: salesByProduct
                },
                inventory: {
                    lowStock
                },
                delivery: {
                    performance: deliveryPerformance
                }
            };

            setData(dashboardData);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Error desconocido'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return { data, loading, error, refetch: fetchDashboardData };
}; 