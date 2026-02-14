import { ResolveFn } from '@angular/router';
import { CatalogosGeneralesService } from '@services/catalogos-generales.service';
import { inject } from '@angular/core';
import { forkJoin } from 'rxjs';

export const asignacionSustitucionResolver: ResolveFn<any> = (route, state) => {
    const catalogosService = inject(CatalogosGeneralesService);

    const ooad = catalogosService.getLstOOADS();
    const especialidades = catalogosService.getLstEspecialidades();

    return forkJoin([ooad, especialidades]);
};
