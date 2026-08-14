export interface GestionPlazaInterface {
  id?: number;
  ooad: string;
  noPlaza: string;
  tipoUnidad: string;
  categoria: string;
  especialidad: string;
  horario: string;
  turno: string;
  zona: string;
  marcaOcupacion: string;
  clasificacionUnidad: string;
  unidad: string;
  adscripcion: string;
  tipoPlaza: string;
  estatus: 'Vacante' | 'Etiquetada' | 'Ocupada';
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
