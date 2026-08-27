export interface GuardarPropuesta {
  idAsignacion: number,
  idSeccionSindical: number
}

export interface ConsultaPropuestaSindicalResponse {
  datosGenerales: DetallePropuestaSindical
}

export interface DetallePropuestaSindical {
  idPropuestaSindical: number,
  refFolioPropuesta: string,
  fechaNacimiento: string,
  idUsuario: number,
  idParticipacion: number,
  idOrigenParticipacion?: number | string | null,
  origenParticipacion?: string | null,
  idConvocatoria: number,
  idAsignacion: number,
  idEstatusValidacion: number,
  refGuidFotografia: string,
  idPerfil: number,
  estatusValidacion: string,
  genero: string,
  curp: string,
  rfc: string,
  nacionalidad: string,
  edad: number,
  entidadDireccion: string,
  municipioDireccion: string,
  codigoPostalDireccion: string,
  coloniaDireccion: string,
  calleDireccion: string,
  numExtDireccion: string,
  numeroPlaza: null,
  cveooadPlaza: string,
  ooadPlaza: string,
  zonaPlaza: string,
  categoriaPlaza: null,
  especialidadPlaza: string,
  tipoUnidad: string,
  modalidad: null,
  nombreCompleto: string,
  matriculaFolio: string,
  matricula: string,
  folio: string,
  correo: string,
  correoAdicional: string,
  otroNumeroContacto: string,
  celularContacto: string
}

export interface Seccion {
  cveOoad: number
  desSeccionSindical: string,
  desTipoSeccion: string,
  idSeccionSindical: number
  indActivo: boolean
}
