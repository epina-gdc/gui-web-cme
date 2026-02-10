import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '@env/environment.development';
import { AsistenciaExtraordinariaResponse } from '@models/asistencia-extraordinaria.interface';
@Injectable({
    providedIn: 'root'
})
export class AsistenciaExtraordinariaService {
    private readonly VERSION_API: string = '/v1/';
    private readonly servicio = 'asistencia/';
    private readonly serverEndPointURLAsistenciaExtraordinaria = environment.api.apiAsistencia + this.VERSION_API + this.servicio;

    private readonly uriBusqueda = 'busqueda/';
    private readonly uriValidacion = 'validar/';
    private readonly uriEliminacion = 'eliminar/';
    private readonly uriConfirmacion = 'confirmar/';

    http: HttpClient = inject(HttpClient);

    header: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
    });

    constructor() { }

    busqueda(matriculaFolio: string): Observable<AsistenciaExtraordinariaResponse> {
        return this.http.get<AsistenciaExtraordinariaResponse>(`${this.serverEndPointURLAsistenciaExtraordinaria}${this.uriBusqueda}${matriculaFolio}`, { headers: this.header });
    }

    validar(matriculaFolio: string): Observable<AsistenciaExtraordinariaResponse> {
        return this.http.get<AsistenciaExtraordinariaResponse>(`${this.serverEndPointURLAsistenciaExtraordinaria}${this.uriValidacion}${matriculaFolio}`, { headers: this.header });
    }

    eliminar(idParticipante: string): Observable<AsistenciaExtraordinariaResponse> {
        return this.http.get<AsistenciaExtraordinariaResponse>(`${this.serverEndPointURLAsistenciaExtraordinaria}${this.uriEliminacion}${idParticipante}`, { headers: this.header });
    }

    confimar(idParticipante: string): Observable<AsistenciaExtraordinariaResponse> {
        return this.http.get<AsistenciaExtraordinariaResponse>(`${this.serverEndPointURLAsistenciaExtraordinaria}${this.uriConfirmacion}${idParticipante}`, { headers: this.header });
    }

    private handleError(error: HttpErrorResponse) {

        if (error.status) {
            //this._alertService?.error("Error "+error.status +'. Contácte al administrador');
            console.log("Error " + error.status + '. Endpoint: ' + error.url + '. Contácte al administrador');
            // Return an observable with a user-facing error message.
        }
        return throwError(error);
    }

}
