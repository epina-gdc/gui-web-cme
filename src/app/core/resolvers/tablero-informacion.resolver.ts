import {ResolveFn} from '@angular/router';
import {inject} from '@angular/core';
import {CatalogosGeneralesService} from '@services/catalogos-generales.service';
import {forkJoin} from 'rxjs';

export const tableroInformacionResolver: ResolveFn<any> = (route, state) => {
  const catalogoService = inject(CatalogosGeneralesService);
  const catalogoTipoAsistencia = catalogoService.getTipoAsistencia();
  const catalogoTurno = catalogoService.getTurno();
  const catalogoConvocatorias = catalogoService.getConvocatorias();
  return forkJoin([catalogoTipoAsistencia,catalogoTurno,catalogoConvocatorias])
};
