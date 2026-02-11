export interface Convocatoria {
  idConvocatoria: number,
  desConvocatoria: string,
  fecInicio: string,
  fecFin: string,
  indActivo: number,
  tipo: TipoConvocatoria,
}

export interface TipoConvocatoria {
  idTipoConvocatoria: number,
  desTipoConvocatoria: string,
  indActivo: number,
}
