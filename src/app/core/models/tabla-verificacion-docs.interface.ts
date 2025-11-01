export interface TablaVerificacionDocsInterface {

  idUsuario: number,
  nombreCompleto: string,
  matriculaFolio: string | null,
  matricula: string | null,
  folio: string | null,
  correo: string,
  especialidad: string,
  idEstatusValidacion: number,
  estatusValidacion: string,
  observaciones: string,
  modalidad: string,
  tipoModalidad: string,
  fechaVerificacion: string,
  idTipoConvocatoria: number,
  desTipoConvocatoria: string,
}
