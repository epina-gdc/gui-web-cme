import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '@env/environment.development';
import {VerificacionDocsInterface} from '@models/verificacion-docs.interface';
import {Observable, catchError, map, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerificacionDocsService {
  private readonly serverVerificacionDocs = environment.api.apiConvocatoria;
  header = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
  });

  constructor(private http: HttpClient) {
  }

  consultarDocs(filtros: VerificacionDocsInterface): Observable<any> {

    let parametros = new HttpParams();

    Object.entries(filtros).forEach(
      ([key, valor]) => {
        if (valor !== null && valor !== undefined && valor !== '') {
          parametros = parametros.set(key, valor.toString());
        }
      });

    const ruta = `${this.serverVerificacionDocs}/verificacion/consultaVerificacionDocumentos`;
    return this.http.get<any>(ruta, {headers: this.header, params: parametros}).pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response
      }),
    )
  }

  consultarPerfilDetalle(id: number): Observable<any> {
    const ruta = `${this.serverVerificacionDocs}/verificacion/aspirante/verificacion-documentos/${id}`;
    const options = { headers: this.header };
    return this.http.get<any>(ruta, options).pipe(
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
