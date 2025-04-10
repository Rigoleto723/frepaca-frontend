import { useEffect, useState } from 'react';
import { Payment } from '../interfaces/Loan';
import client from "../axiosConfig";

const usePayments = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const reloadPayments = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await client.get('/api/pagos/');
            setPayments(response.data);
            console.log('Datos de pagos cargados:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error al cargar los pagos:', error);
            setError(error as Error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const createPayment = async (newPayment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => {
        console.log('Creando nuevo pago:', newPayment);
        try {
            setError(null);
            const response = await client.post('/api/pagos/', newPayment);
            setPayments((prevPayments) => [...prevPayments, response.data]);
            return response.data;
        } catch (error) {
            console.error('Error al crear pago:', error);
            setError(error as Error);
            throw error;
        }
    };

    const updatePayment = async (updatedPayment: Payment) => {
        try {
            setError(null);
            const response = await client.put(
                `/api/pagos/${updatedPayment.id}/`,
                updatedPayment
            );
            setPayments((prevPayments) =>
                prevPayments.map((item) => (item.id === updatedPayment.id ? response.data : item))
            );
            return response.data;
        } catch (error) {
            console.error('Error al actualizar pago:', error);
            setError(error as Error);
            throw error;
        }
    };

    const deletePayment = async (id: string) => {
        try {
            setError(null);
            await client.delete(`/api/pagos/${id}/`);
            setPayments((prevPayments) => prevPayments.filter((item) => item.id !== id));
            return true;
        } catch (error) {
            console.error('Error al eliminar pago:', error);
            setError(error as Error);
            throw error;
        }
    };


    // Cargar clientes al montar el componente
    useEffect(() => {
        reloadPayments().catch(err => {
            console.error('Error al cargar pagos en useEffect:', err);
        });
    }, []);

    return {
        payments,
        loading,
        error,
        reloadPayments,
        createPayment,
        updatePayment,
        deletePayment,
    };
};

export default usePayments; 