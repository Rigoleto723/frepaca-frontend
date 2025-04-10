import { useState, useEffect } from 'react';
import client from '../axiosConfig';
import { DashboardData } from '../interfaces/Dashboard';


export const useDashboard = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await client.get<DashboardData>('/api/metricas/');
            setData(response.data);

        } catch (err) {
            console.error('Error al cargar los datos del dashboard:', err);
            setError(err instanceof Error ? err : new Error('Ocurrió un error desconocido al cargar los datos del dashboard'));
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return {
        data,
        loading,
        error,
        refetch: fetchDashboardData
    };
}; 