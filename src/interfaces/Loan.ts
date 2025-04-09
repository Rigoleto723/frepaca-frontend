export interface Loan {
    id: string;
    cliente: { id: number, nombre: string, apellido: string, numeroDocumento: string };
    montoInicial: number;
    saldoActual: number;
    tasaInteresMensual: number;
    interesMensualGenerado: number;
    fechaInicio: number;
    estado: string;
    fechaFin: string;
    fechaCreacion?: string;
    fechaActualizacion?: string;
} 