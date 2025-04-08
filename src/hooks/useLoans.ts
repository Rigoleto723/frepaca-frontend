import { useEffect, useState } from 'react';
import { Loan } from '../interfaces/Loan';
import client from "../axiosConfig";

const useLoans = () => {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const reloadLoans = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await client.get('/api/prestamos/');
            setLoans(response.data);
            console.log('Datos de prestamos cargados:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error al cargar los prestamos:', error);
            setError(error as Error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const createLoan = async (newLoan: Omit<Loan, 'id' | 'createdAt' | 'updatedAt'>) => {
        console.log('Creando nuevo prestamo:', newLoan);
        try {
            setError(null);
            const response = await client.post('/api/prestamos/', newLoan);
            setLoans((prevLoans) => [...prevLoans, response.data]);
            return response.data;
        } catch (error) {
            console.error('Error al crear prestamo:', error);
            setError(error as Error);
            throw error;
        }
    };

    const updateLoan = async (updatedLoan: Loan) => {
        try {
            setError(null);
            const response = await client.put(
                `/api/prestamos/${updatedLoan.id}/`,
                updatedLoan
            );
            setLoans((prevLoans) =>
                prevLoans.map((item) => (item.id === updatedLoan.id ? response.data : item))
            );
            return response.data;
        } catch (error) {
            console.error('Error al actualizar prestamo:', error);
            setError(error as Error);
            throw error;
        }
    };

    const deleteLoan = async (id: string) => {
        try {
            setError(null);
            await client.delete(`/api/prestamos/${id}/`);
            setLoans((prevLoans) => prevLoans.filter((item) => item.id !== id));
            return true;
        } catch (error) {
            console.error('Error al eliminar prestamo:', error);
            setError(error as Error);
            throw error;
        }
    };

    const getActiveLoans = () => {
        return loans.filter(loan => loan.estado === 'activo');
    };

    // Cargar clientes al montar el componente
    useEffect(() => {
        reloadLoans().catch(err => {
            console.error('Error al cargar prestamos en useEffect:', err);
        });
    }, []);

    return {
        loans,
        loading,
        error,
        reloadLoans,
        createLoan,
        updateLoan,
        deleteLoan,
        getActiveLoans
    };
};

export default useLoans; 