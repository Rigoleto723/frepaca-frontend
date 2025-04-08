import React, { useState, useEffect } from 'react';
import { Loan } from '../../interfaces/Loan';
import { Button } from '../ui/button'


interface LoansFormProps {
    loan?: Loan;
    onSave: (loanData: Omit<Loan, 'id' | 'createdAt' | 'updatedAt'>) => void;
    onClose: () => void;
}

const LoansForm: React.FC<LoansFormProps> = ({ loan, onSave, onClose }) => {

    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<Omit<Loan, 'id' | 'createdAt' | 'updatedAt'>>({
        cliente: loan?.cliente || '',
        montoInicial: loan?.montoInicial || 0,
        saldoActual: loan?.saldoActual || 0,
        tasaInteresMensual: loan?.tasaInteresMensual || 0,
        interesMensualGenerado: loan?.interesMensualGenerado || 0,
        fechaInicio: loan?.fechaInicio || 0,
        fechaFin: loan?.fechaFin || '',
        fechaCreacion: loan?.fechaCreacion || '',
        fechaActualizacion: loan?.fechaActualizacion || '',
        estado: loan?.estado || 'Activo',
    });

    // Añadir un efecto para actualizar el formulario cuando cambia el cliente
    useEffect(() => {
        if (loan) {
            setFormData({
                cliente: loan.cliente || '',
                montoInicial: loan.montoInicial || 0,
                saldoActual: loan.saldoActual || 0,
                tasaInteresMensual: loan.tasaInteresMensual || 0,
                interesMensualGenerado: loan.interesMensualGenerado || 0,
                fechaInicio: loan.fechaInicio || 0,
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
        if (!formData.cliente.trim()) {
            setError('El nombre es obligatorio');
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
                            <input
                                type="text"
                                name="cliente"
                                value={formData.cliente}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-800 text-white"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Monto Inicial</label>
                            <input
                                type="number"
                                name="montoInicial"
                                value={formData.montoInicial}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-800 text-white"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Saldo Actual</label>
                            <select
                                name="saldoActual"
                                value={formData.saldoActual}
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
                            <label className="block text-gray-300 mb-2">Tasa de Interés Mensual</label>
                            <input
                                type="number"
                                name="tasaInteresMensual"
                                value={formData.tasaInteresMensual}
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
                                value={formData.interesMensualGenerado}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-800 text-white"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Fecha de Inicio</label>
                            <input
                                type="date"
                                name="fechaInicio"
                                value={formData.fechaInicio}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-800 text-white"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Fecha de Fin</label>
                            <input
                                type="text"
                                name="fechaFin"
                                value={formData.fechaFin}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-800 text-white"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Fecha de Creación</label>
                            <input
                                type="text"
                                name="fechaCreacion"
                                value={formData.fechaCreacion}
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