import { jsPDF } from "jspdf"
import type { Payment, Loan } from "../interfaces/Loan"


const COMPANY_INFO = {
    name: "Frepaca",
    address: "Calle Principal #123",
    phone: "(+57) 300-123-4567",
    email: "contacto@frepaca.com",
    nit: "900.123.456-7",
    logo: "/logo frepaca.jpeg",
}



export function generatePaymentReceipt(payment: Payment, loan: Loan, preview = false): string | void {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width
    const margin = 20

    // Encabezado
    doc.setFontSize(20)
    doc.text(COMPANY_INFO.name, pageWidth / 2, margin, { align: "center" })

    doc.setFontSize(10)
    doc.text(COMPANY_INFO.address, pageWidth / 2, margin + 10, { align: "center" })
    doc.text(COMPANY_INFO.phone, pageWidth / 2, margin + 15, { align: "center" })
    doc.text(COMPANY_INFO.email, pageWidth / 2, margin + 20, { align: "center" })
    doc.text(`NIT: ${COMPANY_INFO.nit}`, pageWidth / 2, margin + 25, { align: "center" })

    // Título del comprobante
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold");
    doc.text("COMPROBANTE DE PAGO", pageWidth / 2, margin + 40, { align: "center" })
    doc.setFont("helvetica", "normal");

    // Información del préstamo
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold");
    doc.text(`Información del préstamo`, margin, margin + 55)
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold");
    doc.text("Cliente: ", margin, margin + 62)
    doc.setFont("helvetica", "normal");
    doc.text(`${loan.clienteDetalle.nombre} ${loan.clienteDetalle.apellido}`, margin + 15, margin + 62)
    doc.setFont("helvetica", "bold");
    doc.text(`Identificación:`, margin, margin + 69)
    doc.setFont("helvetica", "normal");
    doc.text(`${loan.clienteDetalle.numeroDocumento}`, margin + 25, margin + 69)
    doc.setFont("helvetica", "bold");
    doc.text("Monto Inicial: ", margin, margin + 76)
    doc.setFont("helvetica", "normal");
    doc.text(`${Number(loan.montoInicial).toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    })}`, margin + 25, margin + 76)
    doc.setFont("helvetica", "bold");
    doc.text("Saldo Actual: ", margin, margin + 83)
    doc.setFont("helvetica", "normal");
    doc.text(`${Number(loan.saldoActual).toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    })}`, margin + 25, margin + 83)
    doc.setFont("helvetica", "bold");
    doc.text("Tasa de Interés: ", margin, margin + 90)
    doc.setFont("helvetica", "normal");
    doc.text(`${loan.tasaInteresMensual}% mensual`, margin + 28, margin + 90)

    // Información del pago
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold");
    doc.text("Detalles del Pago", margin, margin + 100)

    doc.setFontSize(10)
    doc.text("Fecha Para efectuar el Pago: ", margin, margin + 107)
    doc.setFont("helvetica", "normal");
    doc.text(`${payment.fechaVencimiento}`, margin + 50, margin + 107)
    doc.setFont("helvetica", "bold");
    doc.text("Fecha en que se realizo el pago: ", margin, margin + 114)
    doc.setFont("helvetica", "normal");
    doc.text(`${payment.fechaPago}`, margin + 55, margin + 114)
    doc.setFont("helvetica", "bold");
    doc.text("Monto Pagado: ", margin, margin + 121)
    doc.setFont("helvetica", "normal");
    doc.text(`${Number(payment.montoPagado).toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    })}`, margin + 27, margin + 121)
    doc.setFont("helvetica", "bold");
    doc.text("Concepto del pago: ", margin, margin + 128)
    doc.setFont("helvetica", "normal");
    doc.text(`${payment.notas}`, margin + 35, margin + 128)
    doc.setFont("helvetica", "bold");
    doc.text("Estado: ", margin, margin + 135)
    doc.setFont("helvetica", "normal");
    doc.text(`${payment.pagado ? 'Pagado' : 'Pendiente'}`, margin + 15, margin + 135)

    // Notas
    if (payment.notaPago) {
        doc.setFont("helvetica", "bold");
        doc.text("Notas: ", margin, margin + 142)
        doc.setFont("helvetica", "normal");
        doc.text(`${payment.notaPago}`, margin + 15, margin + 142)
    }

    if (preview) {
        return doc.output('datauristring')
    } else {
        doc.save(`comprobante_pago_${payment.id}.pdf`)
    }
} 