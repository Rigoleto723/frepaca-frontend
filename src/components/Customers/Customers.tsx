import React, { useState } from 'react';
import useCustomers from '../../hooks/useCustomers';
import { Customer } from '../../interface/Customer';
import CustomerForm from './CustomerForm';
import { toast } from 'react-hot-toast';
import { Button } from '../ui/button'

const typeLabels = {
    regular: "Regular",
    wholesale: "Mayorista",
    premium: "Premium"
}

const zoneLabels = {
    norte: "Zona Norte",
    sur: "Zona Sur",
    este: "Zona Este",
    oeste: "Zona Oeste",
    centro: "Zona Centro"
}
const Customers: React.FC = () => {
    const {
        customers,
        loading,
        error: hookError,
        reloadCustomers,
        createCustomer,
        updateCustomer,
        deleteCustomer
    } = useCustomers();

    const [formError, setFormError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState("")
    const [filterType, setFilterType] = useState<Customer['type'] | 'all'>('all');

    // Filtrar clientes por zona
    const filteredCustomers = customers?.filter(customer => {
        const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType = filterType === "all" || customer.type === filterType
        return matchesSearch && matchesType
    })

    // Manejar guardado de cliente (crear o actualizar)
    const handleSaveCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            if (selectedCustomer) {
                // Actualizar cliente existente
                await updateCustomer({
                    ...customerData,
                    id: selectedCustomer.id,
                    createdAt: selectedCustomer.createdAt,
                    updatedAt: new Date().toISOString()
                });
                toast.success('Cliente actualizado con éxito');
            } else {
                // Crear nuevo cliente
                await createCustomer(customerData);
                toast.success('Cliente creado con éxito');
            }
            setShowForm(false);
            setSelectedCustomer(undefined);
            // Recargar la lista de clientes para asegurar que tenemos los datos más recientes
            await reloadCustomers();
        } catch (err) {
            console.error('Error al guardar cliente:', err);
            setFormError('Error al guardar el cliente. Por favor, intenta de nuevo.');
            toast.error('Error al guardar el cliente. Por favor, intenta de nuevo.');
        }
    };

    // Manejar eliminación de cliente
    const handleDeleteCustomer = async (id: string) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
            try {
                await deleteCustomer(id);
                alert('Cliente eliminado con éxito');
                // No es necesario recargar los clientes ya que deleteCustomer actualiza el estado
            } catch (err) {
                console.error('Error al eliminar cliente:', err);
                setFormError('Error al eliminar el cliente. Por favor, intenta de nuevo.');
            }
        }
    };

    if (loading && customers.length === 0) {
        return (
            <div className="p-6">
                <div className="text-center py-10">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                    <p>Cargando clientes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gestión de Clientes</h1>
                <Button
                    variant={'add'}
                    onClick={() => {
                        setSelectedCustomer(undefined);
                        setShowForm(true);
                    }}
                >
                    Nuevo Cliente
                </Button>
            </div>

            {(hookError || formError) && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> {hookError?.message || formError}</span>
                    <button
                        className="absolute top-0 bottom-0 right-0 px-4 py-3"
                        onClick={() => setFormError(null)}
                    >
                        <span className="sr-only">Cerrar</span>
                        <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            <div className="mb-6 flex gap-4">
                <input
                    type="text"
                    placeholder="Buscar clientes..."
                    className="px-4 py-2 border rounded-lg flex-1 bg-gray-900"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="border rounded py-2 px-3 bg-gray-900"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as Customer['type'] | 'all')}
                >
                    <option value="all">Todos los tipos</option>
                    <option value="regular">Regular</option>
                    <option value="wholesale">Mayorista</option>
                    <option value="premium">Premium</option>
                </select>
            </div>


            {filteredCustomers.length === 0 ? (
                <div className="text-center py-10 bg-gray-100 rounded-lg">
                    <p className="text-gray-500">No hay clientes disponibles.</p>
                    <p className="text-sm text-gray-400 mt-2">Crea un nuevo cliente para comenzar.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-black divide-y divide-gray-700">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Contacto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Zona</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tipo de cliente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredCustomers.map((customer) => (
                                <tr key={customer.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium">
                                                {customer.name}
                                            </div>
                                            {customer.businessName && (
                                                <div className="text-sm">
                                                    {customer.businessName}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium">
                                                {customer.phone}
                                            </div>
                                            {customer.email && (
                                                <div className="text-sm">
                                                    {customer.email}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <div className="text-xs">{zoneLabels[customer.zone]}</div>
                                            {customer.routeOrder > 0 && (
                                                <div className="text-xs">
                                                    Orden: {customer.routeOrder}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${customer.type === 'premium' ? 'bg-purple-100 text-purple-800' :
                                                customer.type === 'wholesale' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-green-100 text-green-800'}`}>
                                            {typeLabels[customer.type]}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {customer.status === 'active' ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-x-2">
                                        <Button
                                            onClick={() => {
                                                setSelectedCustomer(customer);
                                                setShowForm(true);
                                            }}
                                            variant={'edit'}
                                        >
                                        </Button>
                                        <Button
                                            onClick={() => handleDeleteCustomer(customer.id)}
                                            variant={'delete'}
                                        >
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showForm && (
                <CustomerForm
                    customer={selectedCustomer}
                    onSave={handleSaveCustomer}
                    onClose={() => {
                        setShowForm(false);
                        setSelectedCustomer(undefined);
                    }}
                />
            )}
        </div>
    );
};

export default Customers; 