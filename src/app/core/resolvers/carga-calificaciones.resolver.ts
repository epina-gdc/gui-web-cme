import {ResolveFn} from '@angular/router';
import {inject} from '@angular/core';
import {of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {CatalogosGeneralesService} from '@services/catalogos-generales.service';

export const CargaCalificacionesResolver: ResolveFn<any> = (route, state) => {
  const catalogosService = inject(CatalogosGeneralesService);

  return catalogosService.getConvocatorias().pipe(
    catchError(() => of({respuesta: []}))
  );
};
