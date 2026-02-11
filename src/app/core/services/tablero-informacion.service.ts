import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment.development';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {VerificacionDocsExcelInterface} from '@models/verificacion-docs-excel.interface';

@Injectable({
  providedIn: 'root'
})
export class TableroInformacionService {
  private readonly VERSION_API: string = '/v1/';
  private readonly serverEndPointURLTableroInfo = `${environment.api.apiAsistencia}${this.VERSION_API}`;
  header = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
  });

  constructor(private http: HttpClient) { }

  buscarInformacion(fecha:  string | null, idTurno:  string | null, idTipoAsistencia:  string | null): Observable<any> {
    const obj = {fecha, idTurno, idTipoAsistencia};
    const ruta = `${this.serverEndPointURLTableroInfo}tablero/asistencia`;
    const options = { headers: this.header };
    return this.http.post<{ fecha:  string | null, idTurno:  string | null, idTipoAsistencia:  string | null }>
    (ruta, obj, options).pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response;
      })
    );
  }


  descargarExcel(fecha:  string | null, idTurno:  string | null, idTipoAsistencia:  string | null): Observable<Blob> {
    const obj = {fecha, idTurno, idTipoAsistencia};
    const ruta = `${this.serverEndPointURLTableroInfo}tablero/asistencia/excel`;

    return this.http.post(ruta,obj, {
      headers: this.header,
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError),
    );

  }




  private handleError(error: HttpErrorResponse) {

    console.log("Error " + error.status + '. Contácte al administrador');
    // Return an observable with a user-facing error message.
    return throwError(error);
  }
}
