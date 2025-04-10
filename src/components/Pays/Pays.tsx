import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { toast } from 'react-hot-toast';
import { generatePaymentReceipt } from '../../utils/pdfGenerator';
import { Payment } from '../../interfaces/Loan';
import usePayments from '../../hooks/usePayment';
import client from '../../axiosConfig';

const labels = {
    'abono_capital': 'Abono a Capital',
    'interes': 'Interes',
}
const PDFPreviewModal = ({
    isOpen,
    onClose,
    pdfDataUri
}: {
    isOpen: boolean,
    onClose: () => void,
    pdfDataUri: string | null
}) => {
    if (!isOpen || !pdfDataUri) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-4xl h-5/6 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Comprobante de Pago</h2>
                    <div className="space-x-2">
                        <button
                            onClick={() => {
                                window.open(pdfDataUri, '_blank');
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Abrir en nueva pestaña
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
                <div className="flex-grow bg-white rounded overflow-hidden">
                    <iframe
                        src={pdfDataUri}
                        className="w-full h-full"
                        title="Comprobante de Pago"
                    />
                </div>
            </div>
        </div>
    );
};

const Pays: React.FC = () => {
    const { payments, loading, error, reloadPayments } = usePayments();
    const [pdfPreviewUri, setPdfPreviewUri] = useState<string | null>(null);
    const [showPdfPreview, setShowPdfPreview] = useState(false);

    useEffect(() => {
        reloadPayments();
    }, []);

    const handleViewReceipt = async (payment: Payment) => {
        try {
            const loan = await client.get(`/api/prestamos/${payment.prestamo}`);
            const pdfUri = generatePaymentReceipt(payment, loan.data, true) as string;
            setPdfPreviewUri(pdfUri);
            setShowPdfPreview(true);
        } catch (err) {
            console.error('Error al generar el comprobante:', err);
            toast.error('Error al generar el comprobante');
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="text-center py-10">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                    <p>Cargando pagos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> {error.message}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Historial de Pagos</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-black divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha de Pago</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Monto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tipo de Pago</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {payments.map((payment) => (
                            <tr key={payment.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{payment.fechaPago}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {Number(payment.monto).toLocaleString('es-CO', {
                                        style: 'currency',
                                        currency: 'COP',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                    })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {labels[payment.tipo as keyof typeof labels]}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Button
                                        variant={'view'}
                                        onClick={() => handleViewReceipt(payment)}
                                    >
                                        Ver Comprobante
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showPdfPreview && (
                <PDFPreviewModal
                    isOpen={showPdfPreview}
                    onClose={() => setShowPdfPreview(false)}
                    pdfDataUri={pdfPreviewUri}
                />
            )}
        </div>
    );
};

export default Pays;
