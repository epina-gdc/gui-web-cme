import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '@env/environment.development';
@Injectable({
    providedIn: 'root'
})
export class AsistenciaExtraordinariaService {

    constructor() { }

    busqueda(matriculaFolio: number): Observable<any> {
        return of({
            "data": [
                {}
            ],
            "total": 1
        });
    }

    validar(matriculaFolio: number): Observable<any> {
        return of({
            "data": [
                {}
            ],
            "total": 1
        });
    }
    eliminar(idParticipante: number): Observable<any> {
        return of({
            "data": [
                {}
            ],
            "total": 1
        });
    }
    confimar(idParticipante: number): Observable<any> {
        return of({
            "data": [
                {}
            ],
            "total": 1
        });
    }


}
