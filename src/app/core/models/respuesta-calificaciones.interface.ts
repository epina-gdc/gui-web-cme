export interface RespuestaCalificaciones {
  idEstatusCarga: 0 | 1 | 2 | 3,
  horaInicioFormateada: string,
  fechaFinFormateada: string,
  horaFinFormateada: string,
  numConCalificacion: number,
  numSinCalificacion: number,
  porcentaje: number,
  fechaInicioFormateada: string
}
