export interface TableroAsistenciaInterface {
  asistenciaIntExt: ContadoresGenerales[],
  diaTurnoAsistenciaCita: Asistencia[],
  asistenciaCitaPorHora: Asistencia[],
  diaTurnoAsistenciaExtraordinaria: Asistencia[],
  asistenciaExtraordinariaPorHora: Asistencia[],
}

export interface ContadoresGenerales {
  descripcion: string,
  total: string,
  conteoInterno: string,
  conteoExterno: string
}


export interface Asistencia {
  desTurno: string,
  hora: string,
  conteo: number
}
