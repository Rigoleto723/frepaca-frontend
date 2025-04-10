import React, { useState, useEffect, useMemo } from 'react';
import Select from "react-select";
import { Loan } from '../../interfaces/Loan';
import { Button } from '../ui/button'
import { Customer } from '../../interfaces/Customer';
import useCustomers from '../../hooks/useCustomers';


interface LoansFormProps {
    loan?: Loan;
    onSave: (loanData: Omit<Loan, 'id' | 'createdAt' | 'updatedAt'>) => void;
    onClose: () => void;
}

const LoansForm: React.FC<LoansFormProps> = ({ loan, onSave, onClose }) => {
    const { customers, loading: loadingCustomers } = useCustomers();
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<Omit<Loan, 'id' | 'createdAt' | 'updatedAt'>>({
        cliente: loan?.cliente || 0,
        clienteDetalle: loan?.clienteDetalle || { id: 0, nombre: '', apellido: '', numeroDocumento: '' },
        montoInicial: loan?.montoInicial || 0,
        saldoActual: loan?.saldoActual || 0,
        tasaInteresMensual: loan?.tasaInteresMensual || 0,
        interesMensualGenerado: loan?.interesMensualGenerado || 0,
        fechaInicio: loan?.fechaInicio || '',
        fechaFin: loan?.fechaFin || '',
        fechaCreacion: loan?.fechaCreacion || '',
        fechaActualizacion: loan?.fechaActualizacion || '',
        estado: loan?.estado || 'Activo',
    });

    // Añadir un efecto para actualizar el formulario cuando cambia el cliente
    useEffect(() => {
        if (loan) {
            setFormData({
                cliente: loan.cliente || 0,
                clienteDetalle: loan.clienteDetalle || { id: 0, nombre: '', apellido: '', numeroDocumento: '' },
                montoInicial: loan.montoInicial || 0,
                saldoActual: loan.saldoActual || 0,
                tasaInteresMensual: loan.tasaInteresMensual || 0,
                interesMensualGenerado: loan.interesMensualGenerado || 0,
                fechaInicio: loan.fechaInicio || '',
                fechaFin: loan.fechaFin || '',
                fechaCreacion: loan.fechaCreacion || '',
                fechaActualizacion: loan.fechaActualizacion || '',
                estado: loan.estado || 'Activo',
            });
        }
    }, [loan]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        // Para campos numéricos, convertir a número
        if (type === 'number') {
            setFormData({
                ...formData,
                [name]: parseFloat(value)
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
        if (!formData.cliente) {
            setError('El cliente es obligatorio');
            return;
        }

        if (!formData.montoInicial) {
            setError('El monto inicial es obligatorio');
            return;
        }

        if (!formData.saldoActual) {
            setError('El saldo actual es obligatorio');
            return;
        }

        // Enviar datos al componente padre
        onSave(formData);
    };

    const customerOptions = useMemo(() => {
        return customers.map(customer => ({
            value: customer.id,
            label: `${customer.nombre} ${customer.apellido} - ${customer.numeroDocumento}`,
            customer: customer
        }));
    }, [customers]);

    const selectedCustomerOption = useMemo(() => {
        if (!formData.clienteDetalle) return null;
        return customerOptions.find(option => option.value === formData.cliente);
    }, [formData.cliente, customerOptions]);

    const handleCustomerChange = (selectedOption: { value: number; label: string; customer: Customer } | null) => {
        setFormData(prev => ({
            ...prev,
            cliente: selectedOption ? selectedOption.customer.id : 0
        }));
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-[800px] shadow-lg rounded-md bg-black">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium leading-6 text-white">
                        {loan ? 'Editar Préstamo' : 'Nuevo Préstamo'}
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
                            <label className="block text-gray-300 mb-2">Cliente</label>
                            <Select
                                value={selectedCustomerOption}
                                onChange={handleCustomerChange}
                                required
                                options={customerOptions}
                                isDisabled={loadingCustomers}
                                isLoading={loadingCustomers}
                                placeholder="Selecciona un cliente"
                                noOptionsMessage={() => loadingCustomers ? 'Cargando clientes...' : 'No hay clientes disponibles'}
                                styles={{
                                    container: (base) => ({
                                        ...base,
                                        width: '100%'
                                    }),
                                    control: (base) => ({
                                        ...base,
                                        background: '#374151',
                                        borderColor: '#4B5563',
                                        '&:hover': {
                                            borderColor: '#6B7280'
                                        }
                                    }),
                                    menu: (base) => ({
                                        ...base,
                                        background: '#374151',
                                        border: '1px solid #4B5563'
                                    }),
                                    option: (base, state) => ({
                                        ...base,
                                        background: state.isFocused ? '#4B5563' : '#374151',
                                        color: 'white',
                                        '&:hover': {
                                            background: '#4B5563'
                                        }
                                    }),
                                    singleValue: (base) => ({
                                        ...base,
                                        color: 'white'
                                    }),
                                    input: (base) => ({
                                        ...base,
                                        color: 'white'
                                    }),
                                    placeholder: (base) => ({
                                        ...base,
                                        color: '#9CA3AF'
                                    })
                                }}

                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Monto Inicial</label>
                            <input
                                type="number"
                                name="montoInicial"
                                value={formData.montoInicial}
                                onChange={(e) => {
                                    const value = parseFloat(e.target.value);
                                    handleChange(e);
                                    // Si es un nuevo préstamo (no hay loan existente), actualiza el saldo actual
                                    if (!loan) {
                                        setFormData(prev => ({
                                            ...prev,
                                            saldoActual: value
                                        }));
                                    }
                                }}
                                className="w-full p-2 border rounded bg-gray-800 text-white"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Tasa de Interés Mensual</label>
                            <input
                                type="number"
                                name="tasaInteresMensual"
                                value={Number(formData.tasaInteresMensual).toFixed(1)}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-800 text-white"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Intereses Mensuales Generados</label>
                            <input
                                type="text"
                                name="interesMensualGenerado"
                                value={(formData.montoInicial * formData.tasaInteresMensual / 100).toLocaleString('es-CO', {
                                    style: 'currency',
                                    currency: 'COP',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                })}
                                className="w-full p-2 border rounded bg-gray-800 text-white"
                                disabled
                                readOnly
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Fecha de Inicio</label>
                            <input
                                type="date"
                                name="fechaInicio"
                                value={formData.fechaInicio || new Date().toISOString().split('T')[0]}
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

export default LoansForm; 