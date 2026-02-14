import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, map, Observable, throwError} from 'rxjs';
import {environment} from '@env/environment.development';
import { AsignacionRequest, DisponiblesRequest } from '@models/datosAsignacion';

@Injectable({
  providedIn: 'root'
})
export class AsignacionPlazaService {
  private readonly version: string = '/v1/';
  private urlAsignacion: string = environment.api.apiAsignacionPlaza + this.version;
  
  header = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
  });

  http: HttpClient = inject(HttpClient);

  getAspirante(matricula: string): Observable<any> {
    return this.http.get(`${this.urlAsignacion}plaza/aspirante-por-matriculaFolio?matriculaFolio=${matricula}`);
  }
  getEspecialidadByMatricula(matricula: string): Observable<any> {
    return this.http.get(`${this.urlAsignacion}plaza/especialidad-por-matriculaFolio?matriculaFolio=${matricula}`);
  }
  getOoadByEspecialidad(idRegimen: number, cveEspecialidad: number): Observable<any> {
    return this.http.get(`${this.urlAsignacion}plaza/ooad-por-especialidad?regimen=${idRegimen}&cveEspecialidad=${cveEspecialidad}`);
  }
  getUnidadByOoad(idRegimen: number, cveEspecialidad: number, cveOoad: number): Observable<any> {
    return this.http.get(`${this.urlAsignacion}plaza/unidad-por-ooad?regimen=${idRegimen}&cveEspecialidad=${cveEspecialidad}&cveOoad=${cveOoad}`);
  }

  plazasDisponibles(request: DisponiblesRequest, page: number, size:number): Observable<any> {
    let ruta = `${this.urlAsignacion}plaza/disponibles?page=${page}&size=${size}`
    return this.http.post<DisponiblesRequest>(ruta, request, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response
      }),
    )
  }

  asignarPlaza(request: AsignacionRequest): Observable<any> {
    let ruta = `${this.urlAsignacion}plaza/asignar`
    return this.http.post<AsignacionRequest>(ruta, request, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response
      }),
    )
  }

  private handleError(error: HttpErrorResponse) {
   console.log("Error " + error.status + '. Contácte al administrador');
    // Return an observable with a user-facing error message.
    return throwError(error);
  }


}
