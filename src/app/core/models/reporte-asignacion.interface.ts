import { HttpRespuesta } from '@models/http-respuesta.interface';
export interface ReporteAsignacionFiltro {
  idConvocatoria?: number | null;
  cveOoad?: string | number | null;
  cveZona?: string | number | null;
  idTipoAsignacion?: number | null;
  cveEspecialidad?: string | null;
  numPlaza?: string | number | null;
  matriculaFolio?: string | null;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  page?: number | null;
  size?: number | null;
}

export interface ReporteAsignacionRegistro {
  idAsignacion?: number | null;
  idUsuario?: number | null;
  noOoad?: number | string | null;
  numOoad?: number | string | null;
  cveOoad?: number | string | null;
  ooad?: string | null;
  desOoad?: string | null;
  claveZona?: number | string | null;
  cveZona?: number | string | null;
  zona?: string | null;
  desZona?: string | null;
  tipoAsignacion?: string | null;
  desTipoAsignacion?: string | null;
  idEstatusVerificacion?: number | null;
  descEstatusVerificacion?: string | null;
  ooadResidencia?: string | null;
  desOoadResidencia?: string | null;
  matriculaFolio?: string | null;
  matricula?: string | null;
  folio?: string | null;
  nombres?: string | null;
  nombre?: string | null;
  nombreCompleto?: string | null;
  primerApellido?: string | null;
  segundoApellido?: string | null;
  nss?: string | null;
  refNss?: string | null;
  curp?: string | null;
  refCurp?: string | null;
  rfc?: string | null;
  refRfc?: string | null;
  claveCategoria?: string | null;
  cveCategoria?: string | null;
  categoria?: string | null;
  descCategoria?: string | null;
  claveEspecialidad?: string | null;
  cveEspecialidad?: string | null;
  especialidad?: string | null;
  desEspecialidad?: string | null;
  descEspecialidad?: string | null;
  plazaAsignada?: string | number | null;
  numPlazaAsignada?: string | number | null;
  numPlaza?: string | number | null;
  claveAdscripcion?: string | null;
  cveAdscripcion?: string | null;
  adscripcion?: string | null;
  descAdscripcion?: string | null;
  claveUnidad?: string | null;
  cveUnidad?: string | null;
  unidad?: string | null;
  descUnidad?: string | null;
  nivelAtencion?: string | null;
  descNivelAtencion?: string | null;
  tipoPlazaDescripcion?: string | null;
  descTipoPlaza?: string | null;
  tipoUnidad?: string | null;
  descTipoUnidad?: string | null;
  marcaOcupacionDescripcion?: string | null;
  descMarcaOcupacion?: string | null;
  horarioDescripcion?: string | null;
  descHorario?: string | null;
  noPropuestaSindical?: string | number | null;
  numPropuestaSindical?: string | number | null;
  motivoRechazo?: string | null;
  descMotivoRechazo?: string | null;
  [key: string]: unknown;
}

export interface ReporteAsignacionPageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface ReporteAsignacionPaginado {
  content: ReporteAsignacionRegistro[];
  page: ReporteAsignacionPageInfo;
}

export interface ReporteAsignacionRespuestaAlterna {
  content?: ReporteAsignacionRegistro[];
  contenido?: ReporteAsignacionRegistro[];
  registros?: ReporteAsignacionRegistro[];
  page?: Partial<ReporteAsignacionPageInfo>;
  totalElements?: number;
  totalElementos?: number;
  totalPages?: number;
  totalPaginas?: number;
  size?: number;
  number?: number;
  pagina?: number;
}

export interface ReporteAsignacionOoad {
  cveOoad: string;
  desOoad: string;
}
export interface ReporteAsignacionEspecialidad {
  cveEspecialidad: string;
  desEspecialidad: string;
}
export interface ReporteAsignacionConvocatoria {
  idConvocatoria: number;
  desConvocatoria: string;
  fecInicio: Date;
  tipo: ReporteAsignacionTipo;
  fecFin: Date;
  indActivo: number;
}
export interface ReporteAsignacionTipo {
  idTipoConvocatoria: number;
  desTipoConvocatoria: string;
  indActivo: number;
}

export interface ReporteDeAsignacionTipo {
  idTipoAsignacion: number;
  tipoAsignacion: string;
  total: number;
}
export interface ReporteAsignacionCatalogos {
  ooads: HttpRespuesta<ReporteAsignacionOoad[]>;
  especialidades: ReporteAsignacionEspecialidad[];
  convicatorias: HttpRespuesta<ReporteAsignacionConvocatoria[]>;
  asignaciones: HttpRespuesta<ReporteDeAsignacionTipo[]>;
}
