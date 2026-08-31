export interface ReportePlazas {
  idPlaza: number | null,
  cveOoad: string | null,
  cvePuesto: string | null,
  cveUnidad: string | null,
  cveAdscripcion: string | null,
  descAdscripcion: string | null,
  refAltoCostoVida: string | null,
  especialidad: string | null,
  descCategoria: string | null,
  descRegimen: string | null,
  descTurno: string | null,
  descTipoPlaza: string | null,
  descMarcaOcupacion: string | null,
  umf: string | null,
  indHospitalNuevo: number | null,
  ubicacion: string | null,
  descZona: string | null,
  direccion: string | null,
  refSueldoMensualBruto: number | null,
  refSueldoMensualNeto: number | null,
  descHorario: string | null,
  numPlaza: string | null,
  clasificacion: string | null,
  descOoad: string | null,
  creditos: number | null,
  refBonoDificilCobertura: number | null,
  indAccesoCredito: number | null,
  refCredAutomotrizImporte: number | null,
  descuentoQuincenalCreditoAutomotriz: number | null,
  refCredHipotecarioImporte: number | null,
  descuentoQuincenalCreditoHipotecario: number | null,
  esFavorita: boolean | null,
  cveZona: number | null,
  idEstatusPlaza: number | null,
  estatusPlaza: string | null,
  idConvocatoria: number | null,
  origenPlaza: string | null,
  desObservaciones: string | null,
}

export interface FiltrosReportePlaza {

  idConvocatoria?: number | null;
  cveOoad?: number | null;
  cveZona?: number | null;
  cveEspecialidad?: number | null;
  cveCategoria?: number | null;
  numPlaza?: string | null;
  cveUnidad?: number | null;
  page?: number;
  size?: number;

}


