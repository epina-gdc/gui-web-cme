import {ResolveFn} from '@angular/router';
import {CatalogosGeneralesService} from '@services/catalogos-generales.service';
import {inject} from '@angular/core';
import {forkJoin} from 'rxjs';

export const inicioResolver: ResolveFn<any> = (route, state) => {
  const catalogosService = inject(CatalogosGeneralesService);
  const sexos = catalogosService.getLstSexos();
  const estadosCiviles = catalogosService.getLstEstadosCiviles();

  return forkJoin([sexos, estadosCiviles]);
};
