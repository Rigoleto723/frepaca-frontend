import React, { useState, useEffect } from 'react';
import { Customer } from '../../interface/Customer';
import useRoutes from '../../hooks/useRoutes';
import { Button } from '../ui/button'


interface CustomerFormProps {
    customer?: Customer;
    onSave: (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => void;
    onClose: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ customer, onSave, onClose }) => {
    // Obtener las rutas disponibles
    const { route: routes, loading: loadingRoutes } = useRoutes();

    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>>({
        name: customer?.name || '',
        businessName: customer?.businessName || '',
        documentType: customer?.documentType || 'CC',
        documentNumber: customer?.documentNumber || '',
        phone: customer?.phone || '',
        email: customer?.email || '',
        address: customer?.address || '',
        city: customer?.city || '',
        zone: customer?.zone || 'norte', // Valor por defecto para evitar error de tipo
        type: customer?.type || 'regular',
        status: customer?.status || 'active',
        notes: customer?.notes || '',
        routeOrder: customer?.routeOrder || 0,
        default_route: typeof customer?.default_route === 'object' && customer?.default_route?.id
            ? Number(customer.default_route.id)
            : typeof customer?.default_route === 'number'
                ? customer.default_route
                : undefined,
    });

    // Añadir un efecto para actualizar el formulario cuando cambia el cliente
    useEffect(() => {
        if (customer) {
            setFormData({
                name: customer.name || '',
                businessName: customer.businessName || '',
                documentType: customer.documentType || 'CC',
                documentNumber: customer.documentNumber || '',
                phone: customer.phone || '',
                email: customer.email || '',
                address: customer.address || '',
                city: customer.city || '',
                zone: customer.zone || 'norte',
                type: customer.type || 'regular',
                status: customer.status || 'active',
                notes: customer.notes || '',
                routeOrder: customer.routeOrder || 0,
                default_route: typeof customer.default_route === 'object' && customer.default_route?.id
                    ? Number(customer.default_route.id)
                    : typeof customer.default_route === 'number'
                        ? customer.default_route
                        : undefined,
            });
        }
    }, [customer]);

    // Añadir logs para depuración
    useEffect(() => {
        console.log("Cliente recibido:", customer);
        console.log("Ruta por defecto:", customer?.default_route);
        console.log("ID de ruta por defecto:", formData.default_route);
    }, [customer, formData.default_route]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        // Para campos numéricos, convertir a número
        if (type === 'number') {
            setFormData({
                ...formData,
                [name]: parseInt(value, 10)
            });
        } else if (name === 'default_route') {
            // Para la ruta por defecto, convertir a número o undefined si está vacío
            setFormData({
                ...formData,
                default_route: value ? Number(value) : undefined
            });
        } else if (name === 'zone') {
            // Manejar el campo zone correctamente
            setFormData({
                ...formData,
                zone: value as Customer['zone']
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
        if (!formData.name.trim()) {
            setError('El nombre es obligatorio');
            return;
        }

        if (!formData.documentNumber.trim()) {
            setError('El número de documento es obligatorio');
            return;
        }

        if (!formData.phone.trim()) {
            setError('El teléfono es obligatorio');
            return;
        }

        // Log para depuración antes de enviar
        console.log("Datos a enviar:", formData);

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
                            <label className="block text-gray-300 mb-2">Nombre</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-800 text-white"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Nombre del Negocio</label>
                            <input
                                type="text"
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-800 text-white"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Tipo de Documento</label>
                            <select
                                name="documentType"
                                value={formData.documentType}
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
                                name="documentNumber"
                                value={formData.documentNumber}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-800 text-white"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Teléfono</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
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
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-800 text-white"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Ciudad</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-800 text-white"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Zona</label>
                            <select
                                name="zone"
                                value={formData.zone}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-800 text-white"
                            >
                                <option value="">Seleccionar zona...</option>
                                <option value="norte">Norte</option>
                                <option value="sur">Sur</option>
                                <option value="este">Este</option>
                                <option value="oeste">Oeste</option>
                                <option value="centro">Centro</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Tipo de Cliente</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-800 text-white"
                            >
                                <option value="regular">Regular</option>
                                <option value="premium">Premium</option>
                                <option value="wholesale">Mayorista</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Estado</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-800 text-white"
                            >
                                <option value="active">Activo</option>
                                <option value="inactive">Inactivo</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Orden en Ruta</label>
                            <input
                                type="number"
                                name="routeOrder"
                                value={formData.routeOrder}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-800 text-white"
                                min="0"
                            />
                        </div>

                        {/* Campo para seleccionar la ruta por defecto */}
                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Ruta por Defecto</label>
                            <select
                                name="default_route"
                                value={formData.default_route?.toString() || ""}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-800 text-white"
                                disabled={loadingRoutes}
                            >
                                <option value="">
                                    {loadingRoutes ? "Cargando rutas..." : "Sin ruta asignada"}
                                </option>
                                {!loadingRoutes && routes.map((route) => (
                                    <option key={route.id} value={route.id}>
                                        {route.name} ({route.zone})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2">Notas</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
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