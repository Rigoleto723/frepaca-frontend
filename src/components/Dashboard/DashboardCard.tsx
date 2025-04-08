import React from 'react';

interface DashboardCardProps {
    title: string;
    value: string | number;
    icon?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon }) => (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            {icon && <span className="text-2xl">{icon}</span>}
        </div>
        <p className="text-3xl font-bold text-white">{value}</p>
    </div>
); 