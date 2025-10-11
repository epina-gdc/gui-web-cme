export interface VerificacionDocumentos {
  nombre: string,
  matricula: string,
  correo: string,
  especialidad: string,
  estatus: EstatusDocumentacion,
  observaciones: string,
  modalidad: string,
  tipoModalidad: string,
  fecha: string
}

export enum EstatusDocumentacion {
  "No cumple con requisitos",
  "Cumple con requisitos",
  "Revisión documental",
  "Pendiente"
}
