"use client"

import React, { useState } from "react"
import { toast } from "react-hot-toast"
import UserForm from "./UserForm"
import useUsers from "../../hooks/useUsers"
import { User as UserType } from "../../interfaces/User"
import { useSession } from "../../context/sessionContext"


const Users: React.FC = () => {
    const roleLabels: Record<string, string> = {
        'admin': "Administrador",
        'user': "Usuario",
    }

    const { users, loading, error, reloadUsers, deleteUser, resetPassword } = useUsers()
    const [showForm, setShowForm] = useState(false)
    const [selectedUser, setSelectedUser] = useState<UserType | undefined>(undefined)
    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState<string>("")
    const [formError, setFormError] = useState<string | null>(null)
    const { user: currentUser } = useSession()

    // Manejar la eliminación de un usuario
    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
            return
        }

        try {
            await deleteUser(userId)
            toast.success("Usuario eliminado con éxito")
        } catch (error) {
            console.error("Error al eliminar el usuario:", error)
            setFormError(`Error al eliminar el usuario: ${(error as Error).message || 'Error desconocido'}`)
            toast.error("Error al eliminar el usuario")
        }
    }

    // Manejar el restablecimiento de contraseña
    const handleResetPassword = async (userId: string) => {
        if (!window.confirm("¿Estás seguro de que deseas restablecer la contraseña de este usuario?")) {
            return
        }

        try {
            await resetPassword(userId)
            toast.success("Contraseña restablecida con éxito")
        } catch (error) {
            console.error("Error al restablecer la contraseña:", error)
            setFormError(`Error al restablecer la contraseña: ${(error as Error).message || 'Error desconocido'}`)
            toast.error("Error al restablecer la contraseña")
        }
    }

    // Función auxiliar para obtener el rol del usuario
    const getUserRole = (user: UserType): string => {
        if (!user.groups || user.groups.length === 0) return '';
        const group = user.groups[0];
        return typeof group === 'string' ? group : group.name;
    };

    // Asegurarnos de que users sea siempre un array
    const usersArray = Array.isArray(users) ? users : [];

    const filteredUsers = usersArray.filter((user: UserType) => {
        // Obtener el rol del usuario
        const userRole = getUserRole(user);

        // Filtrar por término de búsqueda
        const matchesSearch = searchTerm === "" ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.last_name || '').toLowerCase().includes(searchTerm.toLowerCase());

        // Filtrar por rol
        const matchesRole = roleFilter === "" || userRole.toLowerCase() === roleFilter.toLowerCase();

        return matchesSearch && matchesRole;
    });

    // Cerrar el formulario y recargar los usuarios
    const handleCloseForm = () => {
        setShowForm(false)
        setSelectedUser(undefined)
        reloadUsers()
    }

    // Abrir el formulario para editar un usuario
    const handleEditUser = (user: UserType) => {
        console.log('Editando usuario:', user);
        setSelectedUser(user)
        setShowForm(true)
    }

    const canEditUser = (user: UserType) => {
        return currentUser?.id !== user.id;
    };

    if (loading && users.length === 0) {
        return (
            <div className="p-6">
                <div className="text-center py-10">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                    <p>Cargando usuarios...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex justify-between items-center">
                <div>
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
                <button
                    onClick={() => reloadUsers()}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Gestión de Usuarios</h1>
                <button
                    onClick={() => {
                        setSelectedUser(undefined)
                        setShowForm(true)
                    }}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Nuevo Usuario
                </button>
            </div>

            {formError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex justify-between items-center">
                    <div>
                        <strong className="font-bold">Error:</strong>
                        <span className="block sm:inline"> {formError}</span>
                    </div>
                    <button
                        onClick={() => setFormError(null)}
                        className="text-red-700"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            <div className="mb-6 flex gap-4">
                <input
                    type="text"
                    placeholder="Buscar por nombre, apellido, usuario o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border rounded-lg flex-1 bg-gray-900"
                />

                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="border rounded py-2 px-3 bg-gray-900"
                >
                    <option value="">Todos los roles</option>
                    <option value="Admin">Administrador</option>
                    <option value="Ventas">Ventas</option>
                    <option value="Conductor">Conductor</option>
                </select>
            </div>

            {filteredUsers.length === 0 ? (
                <div className="text-center py-10 bg-gray-800 rounded-lg">
                    <p className="text-gray-500">No se encontraron usuarios.</p>
                </div>
            ) : (
                <div className="bg-black rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                    Usuario
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                    Nombre
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                    Rol
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-black divide-y divide-gray-200 text-white">
                            {filteredUsers.map((user) => {
                                const userRole = getUserRole(user);
                                return (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium">
                                                {user.username}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm">
                                                {user.first_name} {user.last_name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm">
                                                {roleLabels[userRole] || userRole}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                {canEditUser(user) && (
                                                    <>
                                                        <button
                                                            onClick={() => handleEditUser(user)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            onClick={() => handleResetPassword(user.id)}
                                                            className="text-yellow-600 hover:text-yellow-900"
                                                        >
                                                            Restablecer Contraseña
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {showForm && (
                <UserForm
                    user={selectedUser}
                    onClose={handleCloseForm}
                />
            )}
        </div>
    )
}

export default Users 