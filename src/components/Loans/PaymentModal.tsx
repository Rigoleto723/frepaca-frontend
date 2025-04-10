import React, { useState } from 'react';
import { Button } from '../ui/button';
import { toast } from 'react-hot-toast';
import client from '../../axiosConfig';

interface PaymentModalProps {
    loanId: string;
    paymentId?: string;
    type: 'interes' | 'abono_capital';
    montoCobro?: number;
    fechaVencimiento?: string;
    onClose: () => void;
    onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ loanId, paymentId, type, montoCobro, fechaVencimiento, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        monto: montoCobro?.toString() || '',
        notas: '',
        fecha: type === 'interes' && fechaVencimiento ? fechaVencimiento : new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await client.post('/api/pagos/', {
                prestamo: loanId,
                cobro: paymentId,
                monto: parseFloat(formData.monto),
                tipo: type,
                notas: formData.notas,
                fechaPago: formData.fecha
            });

            toast.success(type === 'interes' ? 'Pago registrado con éxito' : 'Abono a capital registrado con éxito');
            onSuccess();
            onClose();
        } catch (err) {
            toast.error(type === 'interes' ? 'Error al registrar el pago' : 'Error al registrar el abono a capital');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const title = type === 'interes' ? 'Registrar Pago de Intereses' : 'Registrar Abono a Capital';
    const buttonText = type === 'interes' ? 'Registrar Pago' : 'Registrar Abono';

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-black">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium leading-6 text-white">
                        {title}
                    </h3>
                    <Button
                        onClick={onClose}
                        variant={'close'}
                    >
                        X
                    </Button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2">Fecha del Pago</label>
                        <input
                            type="date"
                            value={formData.fecha}
                            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                            className="w-full p-2 border rounded bg-gray-800 text-white"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2">Monto</label>
                        <input
                            type="number"
                            value={formData.monto}
                            onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                            className="w-full p-2 border rounded bg-gray-800 text-white"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2">Notas</label>
                        <textarea
                            value={formData.notas}
                            onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                            className="w-full p-2 border rounded bg-gray-800 text-white"
                            rows={3}
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
                            disabled={loading}
                        >
                            {loading ? 'Registrando...' : buttonText}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal; 