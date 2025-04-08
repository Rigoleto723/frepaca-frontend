import { useEffect, useState } from 'react';
import { User } from '../interfaces/User';
import client from "../axiosConfig";

const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const reloadUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await client.get('/api/auth/users/');
            setUsers(response.data);
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            setError(`Error al cargar usuarios: ${(error as Error).message || 'Error desconocido'}`);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const createUser = async (newUser: Omit<User, 'id'>) => {
        setError(null);
        try {
            const response = await client.post('/api/auth/register/', newUser);
            await reloadUsers();
            return response.data;
        } catch (error) {
            console.error('Error al crear usuario:', error);
            setError(`Error al crear usuario: ${(error as Error).message || 'Error desconocido'}`);
            throw error;
        }
    };

    const deleteUser = async (id: string) => {
        setError(null);
        try {
            await client.delete(`/api/auth/user/${id}/delete/`);
            await reloadUsers();
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            setError(`Error al eliminar usuario: ${(error as Error).message || 'Error desconocido'}`);
            throw error;
        }
    };

    const editUser = async (updatedUser: User) => {
        setError(null);
        try {
            const response = await client.put(
                `/api/auth/user/${updatedUser.id}/update/`,
                updatedUser
            );
            await reloadUsers();
            return response.data;
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            setError(`Error al actualizar usuario: ${(error as Error).message || 'Error desconocido'}`);
            throw error;
        }
    };

    const resetPassword = async (userId: string) => {
        setError(null);
        try {
            const response = await client.post('/api/auth/reset-password/', {
                user_id: userId
            });
            return response.data;
        } catch (error) {
            console.error('Error al restablecer contraseña:', error);
            setError(`Error al restablecer contraseña: ${(error as Error).message || 'Error desconocido'}`);
            throw error;
        }
    };

    useEffect(() => {
        reloadUsers();
    }, []);

    return {
        users,
        loading,
        error,
        reloadUsers,
        createUser,
        editUser,
        deleteUser,
        resetPassword,
    };
};

export default useUsers; 