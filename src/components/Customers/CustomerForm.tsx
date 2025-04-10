import React, { useState, useEffect } from 'react';
import { Customer } from '../../interfaces/Customer';
import { Button } from '../ui/button'


interface CustomerFormProps {
    customer?: Customer;
    onSave: (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => void;
    onClose: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ customer, onSave, onClose }) => {

    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>>({
        nombre: customer?.nombre || '',
        apellido: customer?.apellido || '',
        tipoDocumento: customer?.tipoDocumento || 'CC',
        numeroDocumento: customer?.numeroDocumento || '',
        telefono: customer?.telefono || '',
        email: customer?.email || '',
        direccion: customer?.direccion || '',
        ciudad: customer?.ciudad || '',
        estado: customer?.estado || 'Activo',
        notas: customer?.notas || '',
    });

    // Añadir un efecto para actualizar el formulario cuando cambia el cliente
    useEffect(() => {
        if (customer) {
            setFormData({
                nombre: customer.nombre || '',
                apellido: customer.apellido || '',
                tipoDocumento: customer.tipoDocumento || 'CC',
                numeroDocumento: customer.numeroDocumento || '',
                telefono: customer.telefono || '',
                email: customer.email || '',
                direccion: customer.direccion || '',
                ciudad: customer.ciudad || '',
                estado: customer.estado || 'activo',
                notas: customer.notas || '',
            });
        }
    }, [customer]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        // Para campos numéricos, convertir a número
        if (type === 'number') {
            setFormData({
                ...formData,
                [name]: parseInt(value, 10)
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validaciones básicas
        if (!formData.nombre.trim()) {
            setError('El nombre es obligatorio');
            return;
        }

        if (!formData.numeroDocumento.trim()) {
            setError('El número de documento es obligatorio');
            return;
        }

        if (!formData.telefono.trim()) {
            setError('El teléfono es obligatorio');
            return;
        }

        // Enviar datos al componente padre
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-[800px] shadow-lg rounded-md bg-black">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium leading-6 text-white">
                        {customer ? 'Editar Cliente' : 'Nuevo Cliente'}
                    </h3>
                    <Button
                        onClick={onClose}
                        variant={'close'}
                    >
                        X
                    </Button>
                </div>

                {error && (
                    <div className="mb-4 p-2 bg-red-500 text-white rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Nombres</label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-800 text-white"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Apellidos</label>
                            <input
                                type="text"
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-800 text-white"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Tipo de Documento</label>
                            <select
                                name="tipoDocumento"
                                value={formData.tipoDocumento}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-800 text-white"
                            >
                                <option value="CC">Cédula de Ciudadanía</option>
                                <option value="NIT">NIT</option>
                                <option value="CE">Cédula de Extranjería</option>
                                <option value="PP">Pasaporte</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Número de Documento</label>
                            <input
                                type="text"
                                name="numeroDocumento"
                                value={formData.numeroDocumento}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-800 text-white"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Teléfono</label>
                            <input
                                type="text"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-800 text-white"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-800 text-white"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Dirección</label>
                            <input
                                type="text"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-800 text-white"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Ciudad</label>
                            <input
                                type="text"
                                name="ciudad"
                                value={formData.ciudad}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-800 text-white"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Estado</label>
                            <select
                                name="estado"
                                value={formData.estado}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-800 text-white"
                            >
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </select>
                        </div>

                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2">Notas</label>
                        <textarea
                            name="notas"
                            value={formData.notas}
                            onChange={handleChange}
                            className="w-full p-2 border rounded bg-gray-800 text-white"
                            rows={4}
                        />
                    </div>

                    <div className="flex justify-end space-x-3">
                        <Button
                            type="button"
                            onClick={onClose}
                            variant={'cancel'}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant={'add'}
                        >
                            Guardar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomerForm; 