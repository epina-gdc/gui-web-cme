import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, map, Observable, throwError} from 'rxjs';
import {environment} from '@env/environment.development';
import { AsignacionRequest, CedulaResponse, DisponiblesRequest } from '@models/datosAsignacion';

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
  getOoadByEspecialidad(idRegimen: number, cveEspecialidad: string): Observable<any> {
    return this.http.get(`${this.urlAsignacion}plaza/ooad-por-especialidad?regimen=${idRegimen}&cveEspecialidad=${cveEspecialidad}`);
  }
  getUnidadByOoad(idRegimen: number, cveEspecialidad: string, cveOoad: string): Observable<any> {
    return this.http.get(`${this.urlAsignacion}plaza/unidad-por-ooad?regimen=${idRegimen}&cveEspecialidad=${cveEspecialidad}&cveOoad=${cveOoad}`);
  }
  getZonaByOoad(idRegimen: number, cveEspecialidad: string, cveOoad: string): Observable<any> {
    return this.http.get(`${this.urlAsignacion}plaza/zona-por-ooad?regimen=${idRegimen}&cveEspecialidad=${cveEspecialidad}&cveOoad=${cveOoad}`);
  }
  getTurnoByEspecialidad(idRegimen: number, cveEspecialidad: string): Observable<any> {
    return this.http.get(`${this.urlAsignacion}plaza/turno-por-especialidad?regimen=${idRegimen}&cveEspecialidad=${cveEspecialidad}`);
  }
  getMarcaOcupacionByEspecialidad(idRegimen: number, cveEspecialidad: string): Observable<any> {
    return this.http.get(`${this.urlAsignacion}plaza/marca-ocupacion-por-especialidad?regimen=${idRegimen}&cveEspecialidad=${cveEspecialidad}`);
  }
  getHorarioByTurno(idRegimen: number, cveEspecialidad: string, cveTurno: string): Observable<any> {
    return this.http.get(`${this.urlAsignacion}plaza/horario-por-turno?regimen=${idRegimen}&cveEspecialidad=${cveEspecialidad}&cveTurno=${cveTurno}`);
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

  descargarCedula(idParticipacion: number): Observable<CedulaResponse> {
      let ruta = `${this.urlAsignacion}plaza/imprimirCedulaAsignacion?idParticipacion=${idParticipacion}`;
      return this.http.get<CedulaResponse>(ruta, {headers: this.header}).pipe(
          catchError(this.handleError),
      );
  }

  private handleError(error: HttpErrorResponse) {
   console.log("Error " + error.status + '. Contácte al administrador');
    // Return an observable with a user-facing error message.
    return throwError(error);
  }


}
