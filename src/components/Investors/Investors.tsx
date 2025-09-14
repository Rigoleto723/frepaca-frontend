import React, { useState } from 'react';
import useInvestors from '../../hooks/useInvestors';
import { Investor } from '../../interfaces/Investors';
import InvestorsForm from './InvestorsForm';
import { toast } from 'react-hot-toast';
import { Button } from '../ui/button'

const Investors: React.FC = () => {
    const {
        investors,
        loading,
        error: hookError,
        reloadInvestors,
        createInvestor,
        updateInvestor,
        deleteInvestor
    } = useInvestors();

    const [formError, setFormError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedInvestor, setSelectedInvestor] = useState<Investor | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState("")

    // Filtrar clientes por zona
    const filteredInvestor = investors?.filter(investor => {
        const matchesSearch = investor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            investor.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            investor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            investor.telefono.toLowerCase().includes(searchTerm.toLowerCase()) ||
            investor.ciudad.toLowerCase().includes(searchTerm.toLowerCase()) ||
            investor.direccion.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesSearch
    })

    // Manejar guardado de Inversor (crear o actualizar)
    const handleSaveInvestor = async (investorData: Omit<Investor, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            if (selectedInvestor) {
                // Actualizar Inversor existente
                await updateInvestor({
                    ...investorData,
                    id: selectedInvestor.id,
                    fechaCreacion: selectedInvestor.fechaCreacion,
                    fechaActualizacion: new Date().toISOString()
                });
                toast.success('Inversor actualizado con éxito');
            } else {
                // Crear nuevo Inversor
                await createInvestor(investorData);
                toast.success('Inversor creado con éxito');
            }
            setShowForm(false);
            setSelectedInvestor(undefined);
            // Recargar la lista de Inversores para asegurar que tenemos los datos más recientes
            await reloadInvestors();
        } catch (err) {
            console.error('Error al guardar Inversor:', err);
            setFormError('Error al guardar el Inversor. Por favor, intenta de nuevo.');
            toast.error('Error al guardar el Inversor. Por favor, intenta de nuevo.');
        }
    };

    // Manejar eliminación de Inversor
    const handleDeleteInvestor = async (id: string) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este inversor?')) {
            try {
                await deleteInvestor(id);
                alert('Inversor eliminado con éxito');
                // No es necesario recargar los clientes ya que deleteInvestor actualiza el estado
            } catch (err) {
                console.error('Error al eliminar Inversor:', err);
                setFormError('Error al eliminar el Inversor. Por favor, intenta de nuevo.');
            }
        }
    };

    if (loading && investors.length === 0) {
        return (
            <div className="p-6">
                <div className="text-center py-10">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                    <p>Cargando Inversores...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gestión de Inversores</h1>
                <Button
                    variant={'add'}
                    onClick={() => {
                        setSelectedInvestor(undefined);
                        setShowForm(true);
                    }}
                >
                    Nuevo Inversor
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
                    placeholder="Buscar Inversores..."
                    className="px-4 py-2 border rounded-lg flex-1 bg-gray-900"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>


            {filteredInvestor.length === 0 ? (
                <div className="text-center py-10 bg-gray-800 rounded-lg">
                    <p className="text-gray-500">No se encontraron Inversores.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-black divide-y divide-gray-700">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Contacto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ciudad y Dirección</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredInvestor.map((investor) => (
                                <tr key={investor.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium">
                                                {investor.nombre} {investor.apellido}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium">
                                                {investor.telefono}
                                            </div>
                                            {investor.email && (
                                                <div className="text-sm">
                                                    {investor.email}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium">
                                                {investor.direccion}
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {investor.ciudad}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${investor.estado === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {investor.estado === 'Activo' ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-x-2">
                                        <Button
                                            onClick={() => {
                                                setSelectedInvestor(investor);
                                                setShowForm(true);
                                            }}
                                            variant={'edit'}
                                        >
                                        </Button>
                                        <Button
                                            onClick={() => handleDeleteInvestor(investor.id.toString())}
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
                <InvestorsForm
                    investor={selectedInvestor}
                    onSave={handleSaveInvestor}
                    onClose={() => {
                        setShowForm(false);
                        setSelectedInvestor(undefined);
                    }}
                />
            )}
        </div>
    );
};

export default Investors; 