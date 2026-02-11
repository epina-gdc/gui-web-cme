import {ResolveFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {VerificacionDocsService} from '@services/verificacion-docs.service';
import {catchError} from 'rxjs/operators';
import {AlertService} from '@services/alert.service';
import {CatalogosGeneralesService} from '@services/catalogos-generales.service';
import {forkJoin} from 'rxjs';

export const tableroInformacionResolver: ResolveFn<any> = (route, state) => {
  const catalogoService = inject(CatalogosGeneralesService);
  const catalogoTipoAsistencia = catalogoService.getTipoAsistencia();
  const catalogoTurno = catalogoService.getTurno();
  const catalogoConvocatorias = catalogoService.getConvocatorias();
  return forkJoin([catalogoTipoAsistencia,catalogoTurno,catalogoConvocatorias])
};
