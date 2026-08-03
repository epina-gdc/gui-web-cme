export interface UnidadPlazaCatalogo {
  cveUnidad: string;
  descUnidad: string;
}

export interface MarcaOcupacionCatalogo {
  cveMarcaOcupacion: number;
  descMarcaOcupacion: string;
}

export interface TurnoPlazaCatalogo {
  cveTurno: number;
  descTurno: string;
}

export interface HorarioPlazaCatalogo {
  cveHorario: string;
  descHorario: string;
}

export interface SedeOoadCatalogo {
  idSedeOoad: number;
  cveOoad: string;
  desOoad: string;
  nomSede: string;
  refDireccion: string;
  nomResponsable: string;
  refTelefonoOficina: string;
  refTelefonoCelular: string;
  refCorreoInstitucional: string;
}

export interface FiltrosOfertaLaboralRequest {
  cveEspecialidad: string | null;
  cveOoad: string | null;
  cveZona: string | null;
  cveUnidad: string | null;
  cveMarcaOcupacion: number | null;
  cveTurno: number | null;
  cveHorario: string | null;
  numPlaza: number | null;
  cveBono: number | null;
  regimen: string | null;
  idUsuario?: number | null;
}
