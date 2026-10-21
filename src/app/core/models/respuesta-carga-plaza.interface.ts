export interface ErrorCargaPlaza {
  registro?: number;
  numFila?: number;
  idPlaza?: number | string;
  noPlaza?: number | string;
  numPlaza?: number | string;
  ooad?: string;
  cveOoad?: number | string;
  descOoad?: string;
  mensaje?: string;
  errores?: string[];
}

export interface RespuestaCargaPlaza {
  nombreArchivo?: string | null;
  fechaInicioFormateada: string;
  horaInicioFormateada: string;
  fechaFinFormateada: string;
  horaFinFormateada: string;
  totalRegistros?: number | null;
  totalRegistrosValidos?: number | null;
  totalRegistrosRechazados?: number | null;
  totalPlazasOfertadas: number | null;
  totalPlazasCredito: number | null;
  idEstatusCarga?: number;
  procesoEnEjecucion?: boolean;
  tienePlazasAsignadas?: boolean;
  tienePlazasOcupadas?: boolean;
  mensajeResultado?: string | null;
  errores?: ErrorCargaPlaza[];
}

export interface RespuestaRegistroCargaPlaza {
  totalRegistros?: number | null;
  totalPlazasOfertadas?: number | null;
  totalPlazasConCredito?: number | null;
  totalErrores?: number | null;
  plazasValidas?: unknown[];
  plazasGuardadas?: unknown[];
  plazasConError?: ErrorCargaPlaza[];
}

export interface ValidacionCargaPlaza {
  puedeIniciarProceso: boolean;
  existenPlazasOcupadas: boolean;
  totalPlazasOcupadas: number;
}
