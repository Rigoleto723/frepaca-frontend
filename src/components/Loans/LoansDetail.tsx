import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loan, Payment } from '../../interfaces/Loan';
import { Button } from '../ui/button';
import { toast } from 'react-hot-toast';
import client from '../../axiosConfig';
import PaymentModal from './PaymentModal';
import { generatePaymentReceipt } from '../../utils/pdfGenerator';

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
                                // Abrir el PDF en una nueva pestaña
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


const LoansDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loan, setLoan] = useState<Loan | null>(null);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [paymentType, setPaymentType] = useState<'interes' | 'abono_capital'>('interes');
    const [pdfPreviewUri, setPdfPreviewUri] = useState<string | null>(null);
    const [showPdfPreview, setShowPdfPreview] = useState(false);

    useEffect(() => {
        const fetchLoanDetails = async () => {
            try {
                const response = await client.get(`/api/prestamos/${id}`);
                setLoan(response.data);
                console.log(response.data);

                const responsePayments = await client.get(`/api/cobros/prestamo/${id}/`);
                console.log(responsePayments.data);
                setPayments(responsePayments.data);
                // Simulación de pagos

            } catch (err) {
                setError('Error al cargar los detalles del préstamo');
                toast.error('Error al cargar los detalles del préstamo');
            } finally {
                setLoading(false);
            }
        };

        fetchLoanDetails();
    }, [id]);

    const handleRegisterPayment = (payment: Payment) => {
        setSelectedPayment(payment);
        setPaymentType('interes');
        setShowPaymentModal(true);
    };

    const handleRegisterCapitalPayment = () => {
        setSelectedPayment(null);
        setPaymentType('abono_capital');
        setShowPaymentModal(true);
    };

    const handlePaymentSuccess = async () => {
        // Recargar los datos del préstamo y los pagos
        try {
            const [loanResponse, paymentsResponse] = await Promise.all([
                client.get(`/api/prestamos/${id}`),
                client.get(`/api/cobros/prestamo/${id}/`)
            ]);
            setLoan(loanResponse.data);
            setPayments(paymentsResponse.data);
        } catch (err) {
            toast.error('Error al actualizar los datos');
        }
    };

    const handleViewReceipt = (payment: Payment) => {
        try {
            if (loan) {
                const pdfUri = generatePaymentReceipt(payment, loan, true) as string;
                setPdfPreviewUri(pdfUri);
                setShowPdfPreview(true);
            } else {
                console.error('No se encontró el préstamo');
                toast.error('No se encontró el préstamo');
            }
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
                    <p>Cargando detalles del préstamo...</p>
                </div>
            </div>
        );
    }

    if (error || !loan) {
        return (
            <div className="p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> {error || 'No se encontró el préstamo'}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Detalles del Préstamo</h1>
                <div className="flex gap-4">
                    <Button
                        variant={'ghost'}
                        onClick={() => navigate('/app/loans')}
                    >
                        Volver
                    </Button>
                </div>
            </div>

            {/* Información del préstamo */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold mb-4">Información del Préstamo</h2>
                    <Button
                        variant={'add'}
                        onClick={handleRegisterCapitalPayment}
                    >
                        Registrar Abono a Capital
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-lg font-semibold text-gray-200">Cliente:</p>
                        <p className="text-white">{loan.clienteDetalle.nombre} {loan.clienteDetalle.apellido}</p>
                        <p className="text-gray-200">{loan.clienteDetalle.numeroDocumento}</p>
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-gray-200">Fecha del Prestamo:</p>
                        <p className="text-white">{loan.fechaInicio}</p>
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-gray-200">Monto Inicial:</p>
                        <p className="text-white">
                            {Number(loan.montoInicial).toLocaleString('es-CO', {
                                style: 'currency',
                                currency: 'COP',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            })}
                        </p>
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-gray-200">Saldo Actual:</p>
                        <p className="text-white">
                            {Number(loan.saldoActual).toLocaleString('es-CO', {
                                style: 'currency',
                                currency: 'COP',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            })}
                        </p>
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-gray-200">Tasa de Interés Mensual:</p>
                        <p className="text-white">{Number(loan.tasaInteresMensual).toFixed(1)}%</p>
                    </div>
                </div>
            </div>

            {/* Tabla de pagos */}
            <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Cuotas Mensuales</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-black divide-y divide-gray-700">
                        <thead className="bg-gray-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha de Generacion</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Monto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha de Pago</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {[...payments].sort((a, b) => new Date(b.fechaVencimiento).getTime() - new Date(a.fechaVencimiento).getTime()).map((payment) => (
                                <tr key={payment.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {payment.fechaVencimiento}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {Number(payment.montoInteres).toLocaleString('es-CO', {
                                            style: 'currency',
                                            currency: 'COP',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0
                                        })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {payment.fechaPago}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${payment.pagado ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {payment.pagado ? 'Pagado' : 'Pendiente'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {payment.pagado === false ? (
                                            <Button
                                                onClick={() => handleRegisterPayment(payment)}
                                                variant={'add'}
                                            >
                                                Registrar Pago
                                            </Button>
                                        ) : (
                                            <Button
                                                variant={'view'}
                                                onClick={() => handleViewReceipt(payment)}
                                            >
                                                Ver Comprobante
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showPaymentModal && (
                <PaymentModal
                    loanId={id || ''}
                    paymentId={selectedPayment?.id}
                    type={paymentType}
                    montoCobro={selectedPayment?.montoInteres}
                    fechaVencimiento={selectedPayment?.fechaVencimiento}
                    onClose={() => {
                        setShowPaymentModal(false);
                        setSelectedPayment(null);
                    }}
                    onSuccess={handlePaymentSuccess}
                />
            )}
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

export default LoansDetail;
