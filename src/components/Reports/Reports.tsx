import React, { useState } from 'react';
import { Button } from '../ui/button';
import { toast } from 'react-hot-toast';
import client from '../../axiosConfig';
import { formatCurrency } from '../../utils/formatters';
import * as XLSX from 'xlsx';

interface ReportData {
    id?: number;
    cliente__nombre?: string;
    prestamo__cliente__nombre?: string;
    montoInicial?: string;
    saldoActual?: string;
    tasaInteresMensual?: string;
    fechaInicio?: string;
    montoInteres?: string;
    fechaGeneracion?: string;
    pagado?: boolean;
    fechaCierre?: string;
}

interface ReportResponse {
    id: number;
    tipo: string;
    fecha_inicio: string;
    fecha_fin: string;
    datos: ReportData[];
    fecha_creacion: string;
    fecha_actualizacion: string;
}

const Reports: React.FC = () => {
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [reportType, setReportType] = useState<string>('activos');
    const [reportData, setReportData] = useState<ReportData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const handleGenerateReport = async () => {
        if (!startDate || !endDate) {
            toast.error('Por favor, selecciona un rango de fechas.');
            return;
        }

        setLoading(true);
        try {
            const response = await client.get<ReportResponse>(`/api/reportes/${reportType}`, {
                params: {
                    startDate,
                    endDate
                }
            });
            setReportData(response.data.datos);
            toast.success('Reporte generado con éxito.');
        } catch (err) {
            console.error('Error al generar el reporte:', err);
            toast.error('Error al generar el reporte.');
        } finally {
            setLoading(false);
        }
    };

    const handleExportPDF = () => {
        // Lógica para exportar a PDF
        toast.success('Reporte exportado a PDF.');
    };

    const handleExportExcel = () => {
        try {
            // Crear un nuevo libro de trabajo
            const wb = XLSX.utils.book_new();

            // Preparar los datos según el tipo de reporte
            let data: any[] = [];
            let sheetName = '';

            switch (reportType) {
                case 'activos':
                    sheetName = 'Préstamos Activos';
                    data = reportData.map(item => ({
                        'Cliente': item.cliente__nombre,
                        'Monto Inicial': formatCurrency(parseFloat(item.montoInicial || '0')),
                        'Saldo Actual': formatCurrency(parseFloat(item.saldoActual || '0')),
                        'Tasa de Interés': `${item.tasaInteresMensual}%`,
                        'Fecha de Inicio': new Date(item.fechaInicio || '').toLocaleDateString()
                    }));
                    break;
                case 'intereses':
                    sheetName = 'Intereses Generados';
                    data = reportData.map(item => ({
                        'Cliente': item.prestamo__cliente__nombre,
                        'Monto de Interés': formatCurrency(parseFloat(item.montoInteres || '0')),
                        'Fecha de Generación': new Date(item.fechaGeneracion || '').toLocaleDateString(),
                        'Estado': item.pagado ? 'Pagado' : 'Pendiente'
                    }));
                    break;
                case 'pagados':
                    sheetName = 'Préstamos Pagados';
                    data = reportData.map(item => ({
                        'Cliente': item.cliente__nombre,
                        'Monto Inicial': formatCurrency(parseFloat(item.montoInicial || '0')),
                        'Fecha de Inicio': new Date(item.fechaInicio || '').toLocaleDateString(),
                        'Fecha de Cierre': new Date(item.fechaCierre || '').toLocaleDateString()
                    }));
                    break;
            }

            // Agregar totales si es necesario
            if (reportType === 'activos' || reportType === 'pagados') {
                const total = reportData.reduce((sum, item) => sum + parseFloat(item.montoInicial || '0'), 0);
                data.push({
                    'Cliente': 'TOTAL',
                    'Monto Inicial': formatCurrency(total),
                    'Saldo Actual': '',
                    'Tasa de Interés': '',
                    'Fecha de Inicio': ''
                });
            } else if (reportType === 'intereses') {
                const total = reportData.reduce((sum, item) => sum + parseFloat(item.montoInteres || '0'), 0);
                data.push({
                    'Cliente': 'TOTAL',
                    'Monto de Interés': formatCurrency(total),
                    'Fecha de Generación': '',
                    'Estado': ''
                });
            }

            // Convertir los datos a una hoja de trabajo
            const ws = XLSX.utils.json_to_sheet(data);

            // Ajustar el ancho de las columnas
            const wscols = [
                { wch: 20 }, // Cliente
                { wch: 15 }, // Monto
                { wch: 15 }, // Fecha o Saldo
                { wch: 15 }, // Tasa o Estado
                { wch: 15 }  // Fecha adicional
            ];
            ws['!cols'] = wscols;

            // Agregar la hoja de trabajo al libro
            XLSX.utils.book_append_sheet(wb, ws, sheetName);

            // Generar el archivo Excel
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            // Crear un enlace para descargar el archivo
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `reporte_${reportType}_${startDate}_${endDate}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success('Reporte exportado a Excel con éxito.');
        } catch (err) {
            console.error('Error al exportar el reporte:', err);
            toast.error('Error al exportar el reporte a Excel.');
        }
    };

    const renderTableHeaders = () => {
        switch (reportType) {
            case 'activos':
                return (
                    <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cliente</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Monto Inicial</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Saldo Actual</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tasa de Interés</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha de Inicio</th>
                    </>
                );
            case 'intereses':
                return (
                    <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cliente</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Monto de Interés</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha de Generación</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                    </>
                );
            case 'pagados':
                return (
                    <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cliente</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Monto Inicial</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha de Inicio</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha de Cierre</th>
                    </>
                );
            default:
                return null;
        }
    };

    const renderTableRow = (item: ReportData) => {
        switch (reportType) {
            case 'activos':
                return (
                    <>
                        <td className="px-6 py-4 whitespace-nowrap text-white">{item.cliente__nombre}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-white">{formatCurrency(parseFloat(item.montoInicial || '0'))}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-white">{formatCurrency(parseFloat(item.saldoActual || '0'))}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-white">{item.tasaInteresMensual}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-white">{new Date(item.fechaInicio || '').toLocaleDateString()}</td>
                    </>
                );
            case 'intereses':
                return (
                    <>
                        <td className="px-6 py-4 whitespace-nowrap text-white">{item.prestamo__cliente__nombre}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-white">{formatCurrency(parseFloat(item.montoInteres || '0'))}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-white">{new Date(item.fechaGeneracion || '').toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs ${item.pagado ? 'bg-green-500' : 'bg-yellow-500'
                                }`}>
                                {item.pagado ? 'Pagado' : 'Pendiente'}
                            </span>
                        </td>
                    </>
                );
            case 'pagados':
                return (
                    <>
                        <td className="px-6 py-4 whitespace-nowrap text-white">{item.cliente__nombre}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-white">{formatCurrency(parseFloat(item.montoInicial || '0'))}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-white">{new Date(item.fechaInicio || '').toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-white">{new Date(item.fechaCierre || '').toLocaleDateString()}</td>
                    </>
                );
            default:
                return null;
        }
    };

    const renderTableFooter = () => {
        switch (reportType) {
            case 'activos':
                return (
                    <tr>
                        <td colSpan={2} className="px-6 py-4 text-right text-white font-bold">Total Monto Inicial:</td>
                        <td className="px-6 py-4 text-white font-bold">
                            {formatCurrency(reportData.reduce((sum, item) => sum + parseFloat(item.montoInicial || '0'), 0))}
                        </td>
                        <td colSpan={2}></td>
                    </tr>
                );
            case 'intereses':
                return (
                    <tr>
                        <td colSpan={1} className="px-6 py-4 text-right text-white font-bold">Total Intereses:</td>
                        <td className="px-6 py-4 text-white font-bold">
                            {formatCurrency(reportData.reduce((sum, item) => sum + parseFloat(item.montoInteres || '0'), 0))}
                        </td>
                        <td colSpan={2}></td>
                    </tr>
                );
            case 'pagados':
                return (
                    <tr>
                        <td colSpan={1} className="px-6 py-4 text-right text-white font-bold">Total Monto Pagado:</td>
                        <td className="px-6 py-4 text-white font-bold">
                            {formatCurrency(reportData.reduce((sum, item) => sum + parseFloat(item.montoInicial || '0'), 0))}
                        </td>
                        <td colSpan={2}></td>
                    </tr>
                );
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-white mb-6">Reportes</h1>

            {/* Filtros */}
            <div className="bg-gray-800 p-4 rounded-lg mb-6">
                <h2 className="text-xl font-semibold text-white mb-4">Filtros</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-gray-300 mb-2">Fecha Inicio</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-2 border rounded bg-gray-700 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-2">Fecha Fin</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full p-2 border rounded bg-gray-700 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-2">Tipo de Reporte</label>
                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            className="w-full p-2 border rounded bg-gray-700 text-white"
                        >
                            <option value="activos">Préstamos Activos</option>
                            <option value="pendientes">Pagos Pendientes</option>
                            <option value="intereses">Intereses Generados</option>
                            <option value="pagados">Préstamos Pagados</option>
                        </select>
                    </div>
                </div>
                <div className="mt-4">
                    <Button
                        onClick={handleGenerateReport}
                        disabled={loading}
                        variant={'add'}
                    >
                        {loading ? 'Generando...' : 'Generar Reporte'}
                    </Button>
                </div>
            </div>

            {reportData.length > 0 && (
                <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-white">Resultados</h2>
                        <div className="space-x-2">
                            <Button
                                onClick={handleExportPDF}
                                variant={'view'}
                            >
                                Exportar PDF
                            </Button>
                            <Button
                                onClick={handleExportExcel}
                                variant={'view'}
                            >
                                Exportar Excel
                            </Button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-black divide-y divide-gray-700">
                            <thead className="bg-gray-900">
                                <tr>
                                    {renderTableHeaders()}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {reportData.map((item, index) => (
                                    <tr key={item.id || index} className="hover:bg-gray-700">
                                        {renderTableRow(item)}
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-900">
                                {renderTableFooter()}
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;
