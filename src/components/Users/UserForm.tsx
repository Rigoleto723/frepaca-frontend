import React, { useState, useEffect } from "react"
import { User } from "../../interfaces/User"
import useUsers from "../../hooks/useUsers"
import { toast } from "react-hot-toast"

interface UserFormProps {
    user?: User
    onClose: () => void
}

const UserForm: React.FC<UserFormProps> = ({ user, onClose }) => {
    const { createUser, editUser } = useUsers()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState<Omit<User, 'id'>>({
        username: user?.username || '',
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        groups: user?.groups?.map(g => typeof g === 'string' ? g : g.name) || [],
        active: user?.active !== undefined ? user.active : true,
        status: user?.status || "active",
    })

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                email: user.email || "",
                groups: user.groups?.map(g => typeof g === 'string' ? g : g.name) || [],
                active: user.active !== undefined ? user.active : true,
                status: user.status || "active",
            })
        }
    }, [user])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked
            setFormData({
                ...formData,
                [name]: checked
            })
        } else if (name === 'group') {
            // Guardamos el nombre del grupo
            setFormData({
                ...formData,
                groups: [value]
            })
        } else {
            setFormData({
                ...formData,
                [name]: value
            })
        }
    }

    // Modificamos la función getCurrentGroup para que devuelva el nombre del grupo
    const getCurrentGroup = (): string => {
        if (!formData.groups || formData.groups.length === 0) {
            return "";
        }

        const firstGroup = formData.groups[0];
        return typeof firstGroup === 'string' ? firstGroup : firstGroup.name;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (user) {
                const formattedData = {
                    ...user,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    groups: [getCurrentGroup()],
                    status: formData.status,
                };

                await editUser(formattedData)
                toast.success("Usuario actualizado con éxito")
            } else {
                const createUserData = {
                    username: formData.username,
                    password: "12345678",
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    group: getCurrentGroup(),
                    status: formData.status,
                };

                await createUser(createUserData)
                toast.success("Usuario creado con éxito")
            }
            onClose()
        } catch (error) {
            console.error("Error al guardar usuario:", error)
            setError(`Error al guardar usuario: ${(error as Error).message || 'Error desconocido'}`)
            toast.error("Error al guardar usuario")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">
                        {user ? "Editar Usuario" : "Crear Nuevo Usuario"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        <strong className="font-bold">Error:</strong>
                        <span className="block sm:inline"> {error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-white mb-1">Cédula (Username)</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-800 text-white"
                                required
                                disabled={!!user} // Deshabilitar si estamos editando
                            />
                        </div>
                        <div>
                            <label className="block text-white mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-800 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-white mb-1">Nombres</label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-800 text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-white mb-1">Apellidos</label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-800 text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-white mb-1">Grupo</label>
                            <select
                                name="group"
                                value={getCurrentGroup()}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-800 text-white"
                                required
                            >
                                <option value="">Seleccione un grupo</option>
                                <option value="admin">Admin</option>
                                <option value="user">Usuario</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-white mb-1">Estado</label>
                            <select
                                name="status"
                                value={formData.status || "active"}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-800 text-white"
                                required
                            >
                                <option value="active">Activo</option>
                                <option value="inactive">Inactivo</option>
                            </select>
                        </div>
                        {!user && (
                            <div className="col-span-2">
                                <p className="text-yellow-400 text-sm">
                                    Nota: La contraseña por defecto será "12345678". El usuario deberá cambiarla en su primer inicio de sesión si la opción está marcada.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Guardando...
                                </span>
                            ) : (
                                "Guardar"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserForm 