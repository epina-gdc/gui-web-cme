import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { environment } from '@env/environment.development';
import { PaginadoFiltros, TipoBusquedaPlaza } from '@models/gestion-plaza.interface';
import { HttpRespuesta } from '@models/http-respuesta.interface';
import { catchError, Observable, throwError } from 'rxjs';

export interface FiltrosPlazaLayout {
  idConvocatoria?: number;
  cveOoad?: number;
  numPlaza?: string;
  page?: number;
  size?: number;
}

@Injectable({
  providedIn: 'root'
})
export class GestionPlazaService {
  private readonly version: string = 'v1/';
  private readonly urlBase = environment.api.apiAdmonPlazas + this.version;

  constructor(private _http: HttpClient){

  }

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

  private handleError(error: HttpErrorResponse) {
      console.error(`Error ${error.status}:`, error);
      return throwError(() => error);
  }

}
