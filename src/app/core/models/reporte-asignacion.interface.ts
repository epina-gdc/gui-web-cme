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
  estatus?: string | null;
  estatusValidacion?: string | null;
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