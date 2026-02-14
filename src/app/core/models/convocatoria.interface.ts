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

export interface ConvocatoriaPermisoSustitucion {
  idConvocatoria: number;
  desConvocatoria: string;
  fecInicio: string;
  fecFin: string;
  tipoConvocatoria: TipoConvocatoria;
  refUrlTableroOferta: string;
  indHabilitaRegistro: number;
  indPermisoSustitucion: number;
  indActivo: number;
}
