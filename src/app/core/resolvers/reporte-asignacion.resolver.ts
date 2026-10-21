import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CatalogosGeneralesService } from '@services/catalogos-generales.service';
import { AsignacionesMonitoreoService } from '@services/asignaciones-monitoreo.service';

export const reporteAsignacionResolver: ResolveFn<any> = (route, state) => {

    const catalogosService: CatalogosGeneralesService = inject(CatalogosGeneralesService);

    const asignacionesMonitoreoService: AsignacionesMonitoreoService = inject(AsignacionesMonitoreoService);

    return forkJoin({
        ooads: catalogosService.getLstOOADS(),
        especialidades: catalogosService.getCollEspecialidades(),
        convicatorias: catalogosService.getConvocatorias(),
        asignaciones: asignacionesMonitoreoService.obtenerAsignacionesPorTipo()
    });
};