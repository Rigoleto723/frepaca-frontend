import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardData } from '../../interfaces/Dashboard';

interface SalesChartProps {
    data: DashboardData['sales']['byProduct'];
}

export const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#4F46E5" name="Ingresos" />
            </BarChart>
        </ResponsiveContainer>
    );
}; 