import { useEffect, useState } from 'react';
import { Customer } from '../interfaces/Customer';
import client from "../axiosConfig";

const useCustomers = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const reloadCustomers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await client.get('/api/clientes/');
            setCustomers(response.data);
            console.log('Datos de clientes cargados:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error al cargar los clientes:', error);
            setError(error as Error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const createCustomer = async (newCustomer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
        console.log('Creando nuevo cliente:', newCustomer);
        try {
            setError(null);
            const response = await client.post('/api/clientes/', newCustomer);
            setCustomers((prevCustomers) => [...prevCustomers, response.data]);
            return response.data;
        } catch (error) {
            console.error('Error al crear cliente:', error);
            setError(error as Error);
            throw error;
        }
    };

    const updateCustomer = async (updatedCustomer: Customer) => {
        try {
            setError(null);
            const response = await client.put(
                `/api/clientes/${updatedCustomer.id}/`,
                updatedCustomer
            );
            setCustomers((prevCustomers) =>
                prevCustomers.map((item) => (item.id === updatedCustomer.id ? response.data : item))
            );
            return response.data;
        } catch (error) {
            console.error('Error al actualizar cliente:', error);
            setError(error as Error);
            throw error;
        }
    };

    const deleteCustomer = async (id: string) => {
        try {
            setError(null);
            await client.delete(`/api/clientes/${id}/`);
            setCustomers((prevCustomers) => prevCustomers.filter((item) => item.id !== Number(id)));
            return true;
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
            setError(error as Error);
            throw error;
        }
    };

    const getActiveCustomers = () => {
        return customers.filter(customer => customer.estado === 'Activo');
    };

    // Cargar clientes al montar el componente
    useEffect(() => {
        reloadCustomers().catch(err => {
            console.error('Error al cargar clientes en useEffect:', err);
        });
    }, []);

    return {
        customers,
        loading,
        error,
        reloadCustomers,
        createCustomer,
        updateCustomer,
        deleteCustomer,
        getActiveCustomers
    };
};

export default useCustomers; 