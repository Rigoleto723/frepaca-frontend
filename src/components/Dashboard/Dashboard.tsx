import React from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import { DashboardCard } from './DashboardCard';
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <DashboardCard
                    title="Total Invertido"
                    value={formatCurrency(data.totalInvertido)}
                    icon="💰"
                />
                <DashboardCard
                    title="Total Intereses"
                    value={formatCurrency(data.totalIntereses)}
                    icon="📈"
                />
                <DashboardCard
                    title="Préstamos Activos"
                    value={data.totalPrestamosActivos}
                    icon="📋"
                />
                <DashboardCard
                    title="Préstamos Pagados"
                    value={data.totalPrestamosPagados}
                    icon="✅"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <DashboardCard
                    title="Cobros Pendientes"
                    value={data.totalCobrosPendientes}
                    icon="⏳"
                />
                <DashboardCard
                    title="Pagos Hoy"
                    value={data.totalPagosHoy}
                    icon="📅"
                />
                <DashboardCard
                    title="Monto Pagos Hoy"
                    value={formatCurrency(data.montoPagosHoy)}
                    icon="💵"
                />
            </div>
        </div>
    );
};

export default Dashboard;

