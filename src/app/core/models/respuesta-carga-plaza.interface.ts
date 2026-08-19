export interface ErrorCargaPlaza {
  registro?: number;
  idPlaza?: number | string;
  noPlaza?: number | string;
  ooad?: string;
  cveOoad?: string;
  mensaje?: string;
}

export interface RespuestaCargaPlaza {
  fechaInicioFormateada: string;
  horaInicioFormateada: string;
  fechaFinFormateada: string;
  horaFinFormateada: string;
  totalPlazasOfertadas: number | null;
  totalPlazasCredito: number | null;
  idEstatusCarga?: number;
  procesoEnEjecucion?: boolean;
  tienePlazasAsignadas?: boolean;
  errores?: ErrorCargaPlaza[];
}