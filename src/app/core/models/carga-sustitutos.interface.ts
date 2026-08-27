export type EstadoCargaSustitutos = 'EN PROCESO' | 'FINALIZADO' | 'INTERRUMPIDO' | 'DESCONOCIDO';

export interface CargaSustitutosResponse {
  idControlCargaSustituto: number | null;
  idConvocatoria: number | null;
  estado: EstadoCargaSustitutos | null;
  fechaInicio: string | null;
  fechaFin: string | null;
  totalRegistros: number;
  totalOoad: number;
  ooadProcesadas: number;
  porcentajeAvance: number;
  mensajeResultado: string | null;
}
