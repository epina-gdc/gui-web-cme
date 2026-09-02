import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { PaginadoFiltros } from '@models/gestion-plaza.interface';
import { HttpRespuesta } from '@models/http-respuesta.interface';
import { catchError, Observable, throwError } from 'rxjs';

export interface FiltrosPlazaLayout {
  idConvocatoria?: number;
  page?: number;
  size?: number;
  cveOoad?: number;
  numPlaza?: string;
  origenPlaza?: string;
}

export interface CambioEstatusPlazaRequest {
  idPlaza: number;
  idEstatus: number;
  desObservaciones?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GestionPlazaService {
  private readonly version: string = '/v1/';
  private readonly urlBase = environment.api.apiAdmonPlazas + this.version;

  constructor(private _http: HttpClient) { }

  consultarPlazaLayout(filtros: FiltrosPlazaLayout = {}): Observable<HttpRespuesta<PaginadoFiltros>> {
    let params = new HttpParams();
    if (filtros.idConvocatoria != null) {
      params = params.set('idConvocatoria', filtros.idConvocatoria.toString());
    }
    if (filtros.cveOoad != null) {
      params = params.set('cveOoad', filtros.cveOoad.toString());
    }
    if (filtros.numPlaza?.trim()) {
      params = params.set('numPlaza', filtros.numPlaza.trim());
    }
    if (filtros.origenPlaza?.trim()) {
      params = params.set('origenPlaza', filtros.origenPlaza.trim());
    }
    if (filtros.page != null) {
      params = params.set('page', filtros.page.toString());
    }
    if (filtros.size != null) {
      params = params.set('size', filtros.size.toString());
    }
    return this._http.get<HttpRespuesta<PaginadoFiltros>>(
      `${this.urlBase}administracionPlazas/busquedaPlazasFiltro`,
      { params }
    ).pipe(
        catchError(this.handleError)
    );
  }

  exportarExcel(): Observable<Blob>{
    return this._http.get(
      `${this.urlBase}administracionPlazas/exportarExcelPlazasNuevas`,
      {
        responseType: 'blob'
      }
    ).pipe(
        catchError(this.handleError)
    );

  }

  cambiarEstatusPlaza(datos: CambioEstatusPlazaRequest): Observable<HttpRespuesta<any>> {
    return this._http.put<HttpRespuesta<any>>(
      `${this.urlBase}administracionPlazas/actualizarEstatusPlaza`,
      datos
    ).pipe(
      catchError(this.handleError)
    );
  }

  eliminarPlaza(idPlaza: number): Observable<HttpRespuesta<any>> {
    return this._http.delete<HttpRespuesta<any>>(
      `${this.urlBase}administracionPlazas/eliminarPlaza/${idPlaza}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error(`Error ${error.status}:`, error);
    return throwError(() => error);
  }
}
