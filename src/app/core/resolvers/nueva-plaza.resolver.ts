import { ResolveFn } from '@angular/router';
import { NuevaPlazaService } from '@services/nueva-plaza.service';
import { inject } from '@angular/core';
import { forkJoin } from 'rxjs';

export const nuevaPlazaResolver: ResolveFn<any> = (route, state) => {
  const nuevaPlazaService = inject(NuevaPlazaService);

  return forkJoin({
    ooads: nuevaPlazaService.getOoads(),
    especialidades: nuevaPlazaService.getEspecialidades(),
    clasificacionesUnidad: nuevaPlazaService.getClasificacionesUnidad(),
    unidades: nuevaPlazaService.getUnidades(),
    adscripciones: nuevaPlazaService.getAdscripciones(),
    puestos: nuevaPlazaService.getPuestos(),
    categorias: nuevaPlazaService.getCategorias(),
    turnos: nuevaPlazaService.getTurnos(),
    horarios: nuevaPlazaService.getHorarios(),
    tiposPlaza: nuevaPlazaService.getTiposPlaza(),
    marcasOcupacion: nuevaPlazaService.getMarcasOcupacion(),
    tiposUnidad: nuevaPlazaService.getTiposUnidad(),
    statusPlaza: nuevaPlazaService.getStatusPlaza(),
  });
};
