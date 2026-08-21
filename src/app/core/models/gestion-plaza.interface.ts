export interface GestionPlazaInterface {
  idPlaza: number;
  cveOoad: string;
  cvePuesto: string;
  cveUnidad: string;
  refAltoCostoVida: number;
  especialidad: string;
  descCategoria: string;
  descRegimen: string;
  descTurno: string;
  descTipoPlaza: string;
  descMarcaOcupacion: string;
  umf: string;
  indHospitalNuevo: number;
  ubicacion: string;
  descZona: string;
  direccion: string;
  refSueldoMensualBruto: number;
  refSueldoMensualNeto: number;
  descHorario: string;
  numPlaza: string;
  clasificacion: string;
  descOoad: string;
  creditos: number;
  refBonoDificilCobertura: number;
  indAccesoCredito: number;
  refCredAutomotrizImporte: number;
  descuentoQuincenalCreditoAutomotriz: number;
  refCredHipotecarioImporte: number;
  descuentoQuincenalCreditoHipotecario: number;
  esFavorita: boolean | number | null;
  cveZona: number;
  idEstatusPlaza: number;
  estatusPlaza: string;
  idConvocatoria: number;
  origenPlaza: string;
  desObservaciones: string;
}

export interface Page {
  size: number,
  number: number,
  totalElements: number,
  totalPages: number,
}

export interface PaginadoFiltros {
  content: GestionPlazaInterface[],
  page: Page
}










export interface FiltroGestionPlazaInterface {
  ooad: string | number | null;
  noPlaza?: string | null;
  page?: number;
  size?: number;
}


export enum TipoBusquedaPlaza {
  BusquedaManual,
  BusquedaLayout
}

export enum AccionPlaza {
  VerDetalle,
  EditarEstatus,
  EditarPlaza,
  EliminarPlaza
}
