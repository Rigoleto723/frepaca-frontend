import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useSession } from '../../context/sessionContext';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '../ErrorFallback';
import client from '../../axiosConfig';
import useUsers from '../../hooks/useUsers';
import { User } from '../../interface/User';

interface UserProfileData {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

function UserProfileContent() {
    const navigate = useNavigate();
    const { user, logout, updateUser } = useSession();
    const { editUser } = useUsers();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [userData, setUserData] = useState<UserProfileData>({
        username: user?.username || '',
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setUserData(prev => ({
                ...prev,
                username: user.username,
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || ''
            }));
            setIsLoading(false);
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            await editUser({
                ...user,
                first_name: userData.first_name,
                last_name: userData.last_name,
                email: userData.email
            });

            toast.success('Información personal actualizada correctamente');

            // Actualizar el usuario en el contexto si es necesario
            if (updateUser) {
                updateUser({
                    ...user,
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    email: userData.email
                });
            }
        } catch (error: any) {
            console.error('Error al actualizar información personal:', error);
            if (error.response?.data) {
                const errorMessage = Object.values(error.response.data)[0];
                toast.error(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage);
            } else {
                toast.error('Error al actualizar información personal');
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (userData.newPassword !== userData.confirmPassword) {
            toast.error('Las contraseñas nuevas no coinciden');
            return;
        }

        if (userData.newPassword.length < 8) {
            toast.error('La contraseña debe tener al menos 8 caracteres');
            return;
        }

        setIsSaving(true);

        try {
            await client.post('/api/auth/change-password/', {
                old_password: userData.currentPassword,
                new_password: userData.newPassword,
                confirm_password: userData.confirmPassword
            });

            toast.success('Contraseña actualizada correctamente');

            setUserData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));

            setTimeout(() => {
                logout();
                toast.success('Por favor, inicie sesión con su nueva contraseña');
                navigate('/login', { replace: true });
            }, 1500);

        } catch (error: any) {
            console.error('Error al cambiar contraseña:', error);
            if (error.response?.data) {
                const errorMessage = error.response.data.detail ||
                    error.response.data.error ||
                    'Error al cambiar contraseña';
                toast.error(errorMessage);
            } else {
                toast.error('Error al cambiar contraseña');
            }
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-4">
                <h1 className="text-xl font-bold mb-4">Mi Perfil</h1>
                <p>Cargando información del usuario...</p>
            </div>
        );
    }

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>

            <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-white">Información Personal</h2>
                <form onSubmit={handleSaveProfile}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-300 mb-1">Cédula (Username)</label>
                            <input
                                type="text"
                                value={userData.username}
                                className="w-full p-2 border rounded bg-gray-700 text-white"
                                disabled
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-1">Nombre</label>
                            <input
                                type="text"
                                name="first_name"
                                value={userData.first_name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-1">Apellido</label>
                            <input
                                type="text"
                                name="last_name"
                                value={userData.last_name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-700 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={userData.email}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-700 text-white"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            disabled={isSaving}
                        >
                            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Cambiar Contraseña</h2>
                <form onSubmit={handleChangePassword}>
                    <div className="space-y-4 mb-4">
                        <div>
                            <label className="block text-gray-300 mb-1">Contraseña Actual</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={userData.currentPassword}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-700 text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-1">Nueva Contraseña</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={userData.newPassword}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-700 text-white"
                                required
                                minLength={8}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-1">Confirmar Nueva Contraseña</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={userData.confirmPassword}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-700 text-white"
                                required
                                minLength={8}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            disabled={isSaving}
                        >
                            {isSaving ? 'Cambiando...' : 'Cambiar Contraseña'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function UserProfile() {
    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => window.location.reload()}
        >
            <UserProfileContent />
        </ErrorBoundary>
    );
} 