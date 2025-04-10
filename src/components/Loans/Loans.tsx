import React, { useState } from 'react';
import useLoans from '../../hooks/useLoans';
import { Loan } from '../../interfaces/Loan';
import LoansForm from './LoansForm';
import { toast } from 'react-hot-toast';
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom';
const Loans: React.FC = () => {
    const {
        loans,
        loading,
        error: hookError,
        reloadLoans,
        createLoan,
        updateLoan,
        deleteLoan
    } = useLoans();

    const [formError, setFormError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState<Loan | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState("")
    const navigate = useNavigate();

    // Filtrar clientes por zona
    const filteredLoans = loans?.filter(loan => {
        const matchesSearch = loan.clienteDetalle.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || loan.clienteDetalle.apellido.toLowerCase().includes(searchTerm.toLowerCase()) || loan.clienteDetalle.numeroDocumento.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesSearch
    })

    // Manejar guardado de cliente (crear o actualizar)
    const handleSaveLoan = async (loanData: Omit<Loan, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            if (selectedLoan) {
                // Actualizar cliente existente
                await updateLoan({
                    ...loanData,
                    id: selectedLoan.id,
                    fechaCreacion: selectedLoan.fechaCreacion,
                    fechaActualizacion: new Date().toISOString()
                });
                toast.success('Cliente actualizado con éxito');
            } else {
                // Crear nuevo cliente
                await createLoan(loanData);
                toast.success('Cliente creado con éxito');
            }
            setShowForm(false);
            setSelectedLoan(undefined);
            // Recargar la lista de clientes para asegurar que tenemos los datos más recientes
            await reloadLoans();
        } catch (err) {
            console.error('Error al guardar cliente:', err);
            setFormError('Error al guardar el cliente. Por favor, intenta de nuevo.');
            toast.error('Error al guardar el cliente. Por favor, intenta de nuevo.');
        }
    };

    // Manejar eliminación de cliente
    const handleDeleteLoan = async (id: string) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este préstamo?')) {
            try {
                await deleteLoan(id);
                alert('Cliente eliminado con éxito');
                // No es necesario recargar los clientes ya que deleteCustomer actualiza el estado
            } catch (err) {
                console.error('Error al eliminar cliente:', err);
                setFormError('Error al eliminar el cliente. Por favor, intenta de nuevo.');
            }
        }
    };

    const handleViewLoan = (id: string) => {
        navigate(`/app/loan-detail/${id}`);
    };

    if (loading && loans.length === 0) {
        return (
            <div className="p-6">
                <div className="text-center py-10">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                    <p>Cargando préstamos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gestión de Préstamos</h1>
                <Button
                    variant={'add'}
                    onClick={() => {
                        setSelectedLoan(undefined);
                        setShowForm(true);
                    }}
                >
                    Nuevo Préstamo
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
                    placeholder="Buscar préstamos..."
                    className="px-4 py-2 border rounded-lg flex-1 bg-gray-900"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>


            {filteredLoans.length === 0 ? (
                <div className="text-center py-10 bg-gray-800 rounded-lg">
                    <p className="text-gray-500">No se encontraron préstamos.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-black divide-y divide-gray-700">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cliente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha Prestamo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Saldo Actual</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tasa de Interés</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredLoans.map((loan) => (
                                <tr key={loan.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium">
                                                {loan.clienteDetalle.nombre} {loan.clienteDetalle.apellido}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {loan.clienteDetalle.numeroDocumento}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium">
                                                {loan.fechaInicio}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {Number(loan.saldoActual).toLocaleString('es-CO', {
                                            style: 'currency',
                                            currency: 'COP',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0
                                        })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {Number(loan.tasaInteresMensual).toFixed(1)}%
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${loan.estado === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {loan.estado === 'Activo' ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-x-2">
                                        <Button
                                            onClick={() => {
                                                setSelectedLoan(loan);
                                                setShowForm(true);
                                            }}
                                            variant={'edit'}
                                        >
                                        </Button>
                                        <Button
                                            onClick={() => handleDeleteLoan(loan.id.toString())}
                                            variant={'delete'}
                                        >
                                        </Button>
                                        <Button
                                            onClick={() => handleViewLoan(loan.id.toString())}
                                            variant={'view'}
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
                <LoansForm
                    loan={selectedLoan}
                    onSave={handleSaveLoan}
                    onClose={() => {
                        setShowForm(false);
                        setSelectedLoan(undefined);
                    }}
                />
            )}
        </div>
    );
};

export default Loans; 