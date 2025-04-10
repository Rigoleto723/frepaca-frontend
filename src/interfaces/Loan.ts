export interface Loan {
    id: string;
    cliente: number;
    clienteDetalle: { id: number, nombre: string, apellido: string, numeroDocumento: string };
    montoInicial: number;
    saldoActual: number;
    tasaInteresMensual: number;
    interesMensualGenerado: number;
    fechaInicio: string;
    estado: string;
    fechaFin: string;
    fechaCreacion?: string;
    fechaActualizacion?: string;
}

export interface Payment {
    id: string;
    prestamo: string;
    montoInteres: number;
    montoPagado: number;
    monto: number;
    tipo: string;
    fechaGeneracion: string;
    fechaVencimiento: string;
    fechaPago: string;
    pagado: boolean;
    notas: string;
    notaPago: string;
}