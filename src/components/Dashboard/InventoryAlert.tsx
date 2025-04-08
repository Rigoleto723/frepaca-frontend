import React from 'react';
import { DashboardData } from '../../interfaces/Dashboard';

interface InventoryAlertProps {
    data: DashboardData['inventory']['lowStock'];
}

export const InventoryAlert: React.FC<InventoryAlertProps> = ({ data }) => {
    return (
        <div className="space-y-4">
            {data.map(product => (
                <div key={product.productId} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                    <div>
                        <h4 className="text-white font-medium">{product.name}</h4>
                        <p className="text-sm text-gray-300">
                            Stock actual: {product.currentStock} kg
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-red-400 font-semibold">
                            Mínimo: {product.minimumStock} kg
                        </p>
                        <p className="text-sm text-gray-300">
                            Diferencia: {product.minimumStock - product.currentStock} kg
                        </p>
                    </div>
                </div>
            ))}
            {data.length === 0 && (
                <p className="text-gray-400 text-center py-4">
                    No hay productos con stock bajo
                </p>
            )}
        </div>
    );
}; 