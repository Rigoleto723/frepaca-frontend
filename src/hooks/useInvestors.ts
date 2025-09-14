import { useEffect, useState } from 'react';
import { Investor } from '../interfaces/Investors';
import client from "../axiosConfig";

const useInvestors = () => {
    const [investors, setInvestors] = useState<Investor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const reloadInvestors = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await client.get('/api/inversionistas/');
            setInvestors(response.data);
            console.log('Datos de inversionistas cargados:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error al cargar los inversionistas:', error);
            setError(error as Error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const createInvestor = async (newInvestor: Omit<Investor, 'id' | 'createdAt' | 'updatedAt'>) => {
        console.log('Creando nuevo inversionista:', newInvestor);
        try {
            setError(null);
            const response = await client.post('/api/inversionistas/', newInvestor);
            setInvestors((prevInvestors) => [...prevInvestors, response.data]);
            return response.data;
        } catch (error) {
            console.error('Error al crear inversionista:', error);
            setError(error as Error);
            throw error;
        }
    };

    const updateInvestor = async (updatedInvestor: Investor) => {
        try {
            setError(null);
            const response = await client.put(
                `/api/inversionistas/${updatedInvestor.id}/`,
                updatedInvestor
            );
            setInvestors((prevInvestor) =>
                prevInvestor.map((item) => (item.id === updatedInvestor.id ? response.data : item))
            );
            return response.data;
        } catch (error) {
            console.error('Error al actualizar inversionista:', error);
            setError(error as Error);
            throw error;
        }
    };

    const deleteInvestor = async (id: string) => {
        try {
            setError(null);
            await client.delete(`/api/inversionistas/${id}/`);
            setInvestors((prevInvestors) => prevInvestors.filter((item) => item.id !== Number(id)));
            return true;
        } catch (error) {
            console.error('Error al eliminar inversor:', error);
            setError(error as Error);
            throw error;
        }
    };

    const getActiveInvestors = () => {
        return investors.filter(investors => investors.estado === 'Activo');
    };

    // Cargar inversionistas al montar el componente
    useEffect(() => {
        reloadInvestors().catch(err => {
            console.error('Error al cargar inversores en useEffect:', err);
        });
    }, []);

    return {
        investors,
        loading,
        error,
        reloadInvestors,
        createInvestor,
        updateInvestor,
        deleteInvestor,
        getActiveInvestors
    };
};

export default useInvestors; 