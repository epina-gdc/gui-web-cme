import { ResolveFn } from '@angular/router';
import { NuevaPlazaService } from '@services/nueva-plaza.service';
import { inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CatalogosGeneralesService } from '@services/catalogos-generales.service';

export const reportePlazaResolver: ResolveFn<any> = (route, state) => {

  const catalogosService: CatalogosGeneralesService = inject(CatalogosGeneralesService);

  return forkJoin({
    ooads: catalogosService.getLstOOADS(),
    especialidades: catalogosService.getLstEspecialidades(),
    categorias: catalogosService.getLstCategorias(),
    tiposUnidades: catalogosService.getLstTiposUnidad()
  });
};
