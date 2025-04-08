import React from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import { DashboardCard } from './DashboardCard';
import { SalesChart } from './SalesChart';
import { InventoryAlert } from './InventoryAlert';
import { DeliveryPerformance } from './DeliveryPerformance';
import { formatCurrency } from '../../utils/formatters';

const Dashboard: React.FC = () => {
    const { data, loading, error } = useDashboard();

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="p-4 bg-red-100 text-red-700 rounded">
            Error al cargar los datos: {error.message}
        </div>
    );

    if (!data) return null;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

            {/* KPIs Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <DashboardCard
                    title="Ventas del Día"
                    value={formatCurrency(data.sales.today)}
                    icon="💰"
                />
                <DashboardCard
                    title="Órdenes Pendientes"
                    value={data.orders.byStatus.pending}
                    icon="📋"
                />
                <DashboardCard
                    title="Tasa de Entrega"
                    value={`${Math.round((data.delivery.performance.reduce((acc, curr) => acc + (curr.deliveredOrders / curr.totalOrders), 0) / data.delivery.performance.length) * 100)}%`}
                    icon="🚚"
                />
                <DashboardCard
                    title="Ventas del Mes"
                    value={formatCurrency(data.sales.thisMonth)}
                    icon="📈"
                />
            </div>

            {/* Gráficos y Estadísticas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold text-white mb-4">Ventas por Producto</h2>
                    <SalesChart data={data.sales.byProduct} />
                </div>
            </div>

            {/* Alertas y Rendimiento */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold text-white mb-4">Alertas de Stock</h2>
                    <InventoryAlert data={data.inventory.lowStock} />
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold text-white mb-4">Rendimiento por Ruta</h2>
                    <DeliveryPerformance data={data.delivery.performance} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

