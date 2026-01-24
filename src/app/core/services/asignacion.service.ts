import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import {plaza} from '@privado/asignacion-plazas/dummies';
import {FiltroConsultaPlazaInterface} from '@models/filtroConsultaPlaza.interface';

@Injectable({
  providedIn: 'root'
})
export class AsignacionService {

  constructor() { }


  consultarPlazas(filtros: FiltroConsultaPlazaInterface): Observable<any>{

    return of(plaza);
  }
}
