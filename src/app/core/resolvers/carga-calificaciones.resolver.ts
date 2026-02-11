import {ResolveFn} from '@angular/router';
import {inject} from '@angular/core';
import {CargaCalificacionesService} from '@services/carga-calificaciones.service';
import {forkJoin, Observable, of} from 'rxjs';
import {AlertService} from '@services/alert.service';
import {catchError, map} from 'rxjs/operators';
import {CatalogosGeneralesService} from '@services/catalogos-generales.service';

export const CargaCalificacionesResolver: ResolveFn<any> = (route, state) => {
  const cargaCalificacionesService: CargaCalificacionesService = inject(CargaCalificacionesService);
  const alertaService: AlertService = inject(AlertService);
  const catalogosService: CatalogosGeneralesService = inject(CatalogosGeneralesService);

  const $validaciones = cargaCalificacionesService.obtenerValidacionCalificaciones();
  const $registro = cargaCalificacionesService.consultaCargaCalificaciones();

  return catalogosService.getConvocatorias();

  const handlePipeError = (obs$: Observable<any>) => obs$.pipe(
    catchError((error) => {
      const msg = error?.error?.mensaje || error?.message || 'Error desconocido';
      return of({error: true, msg});
    })
  )

  return forkJoin([
    handlePipeError($validaciones),
    handlePipeError($registro)
  ]).pipe(
    map(([validaciones, registro]) => {
      const errores: string[] = [];

      if (validaciones.error) errores.push(validaciones.msg);
      if (registro.error) errores.push(registro.msg);

      if (errores.length > 0) {
        const mensajesUnicos = [...new Set(errores)];
        mensajesUnicos.forEach(m => alertaService.error(m));
      }

      return {
        validaciones,
        registro,
        huboError: validaciones.error || registro.error
      };
    })
  );
}
