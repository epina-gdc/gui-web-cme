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
  indActivo?: number,
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

export interface ConvocatoriaPerfil {
  idPerfil: number;
  clave?: string;
  descripcion?: string;
  nomPerfil?: string;
  desPerfil?: string;
  indActivo?: number;
  indPerfilInterno?: number;
}

export interface ConvocatoriaSubperfil {
  idSubperfil: number;
  idPerfil?: number;
  clave?: string;
  descripcion?: string;
  nomSubperfil?: string;
  desSubperfil?: string;
  indActivo?: number;
}

export interface ConvocatoriaDetalle {
  idConvocatoria?: number;
  desConvocatoria: string;
  fecInicio: string;
  fecFin: string;
  idTipoConvocatoria?: number;
  tipoConvocatoria?: TipoConvocatoria;
  refUrlTableroOferta?: string | null;
  indHabilitaRegistro?: number | null;
  indPermisoSustitucion?: number | null;
  fechaInicioRegistro?: string | null;
  fechaFinRegistro?: string | null;
  indActivo?: number | null;
  perfiles?: ConvocatoriaPerfil[];
  subperfiles?: ConvocatoriaSubperfil[];
}

export interface ConvocatoriaActiva {
  idConvocatoria: number;
  desConvocatoria: string;
  fecInicio: string;
  fecFin: string;
  refUrlTableroOferta?: string | null;
  tipo?: TipoConvocatoria;
  stpFechaInicioRegistro?: string | null;
  stpFechaFinRegistro?: string | null;
  perfiles?: ConvocatoriaPerfil[];
  subperfiles?: ConvocatoriaSubperfil[];
  registroActivo: boolean;
  indActivo: number;
}

export interface ConvocatoriaRegistroRequest {
  desConvocatoria: string;
  fecInicio: string;
  fecFin: string;
  idTipoConvocatoria: number;
  refUrlTableroOferta: string | null;
  indHabilitaRegistro: number;
  indPermisoSustitucion: number;
  fechaInicioRegistro: string | null;
  fechaFinRegistro: string | null;
  perfiles: Pick<ConvocatoriaPerfil, 'idPerfil'>[];
  subperfiles: Pick<ConvocatoriaSubperfil, 'idSubperfil'>[];
}
