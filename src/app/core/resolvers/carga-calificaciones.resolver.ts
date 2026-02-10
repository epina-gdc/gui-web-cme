import {ResolveFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {CargaCalificacionesService} from '@services/carga-calificaciones.service';
import {forkJoin} from 'rxjs';

export const CargaCalificacionesResolver: ResolveFn<any> = (route, state) => {
  const cargaCalificacionesService =  inject(CargaCalificacionesService);

  const $validaciones  =  cargaCalificacionesService.obtenerValidacionCalificaciones();
  const $registro = cargaCalificacionesService.consultaCargaCalificaciones();

  return forkJoin([ $validaciones, $registro ])
}
