export interface Loan {
    id: string;
    cliente: string;
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