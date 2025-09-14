export interface Investor {
    id: number
    nombre: string
    apellido: string
    tipoDocumento: 'CC' | 'NIT' | 'CE' | 'PP'
    numeroDocumento: string
    email: string
    telefono: string
    direccion: string
    ciudad: string
    estado: 'Activo' | 'Inactivo'
    notas: string
    fechaCreacion?: string
    fechaActualizacion?: string


} 