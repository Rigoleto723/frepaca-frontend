import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardData } from '../../interfaces/Dashboard';

interface DeliveryPerformanceProps {
    data: DashboardData['delivery']['performance'];
}

export const DeliveryPerformance: React.FC<DeliveryPerformanceProps> = ({ data }) => {
    const chartData = data.map(route => ({
        name: route.routeName,
        entregadas: route.deliveredOrders,
        total: route.totalOrders,
        ingresos: route.revenue
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="entregadas" name="Entregadas" fill="#10B981" />
                <Bar dataKey="total" name="Total" fill="#4F46E5" />
            </BarChart>
        </ResponsiveContainer>
    );
}; 