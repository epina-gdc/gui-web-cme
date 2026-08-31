import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { HttpRespuesta } from '@models/http-respuesta.interface';
import { Paginado } from '@models/paginado.interface';
import { FiltrosReportePlaza, ReportePlazas } from '@models/reporte-plazas.interface';
import { ResponseGeneral } from '@models/responseGeneral';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportePlazasService {
  private readonly V = "/v1/";
  private readonly URL_BASE = `${environment.api.apiAdmonPlazas}${this.V}`;

  constructor(private http: HttpClient) { }


  exportarExcel(filtros: FiltrosReportePlaza = {}): Observable<Blob>{

    const ruta = `${this.URL_BASE}administracionPlazas/exportarExcelPlazas`;
    let params = new HttpParams();

    if (filtros.idConvocatoria != null) {
      params = params.set('idConvocatoria', filtros.idConvocatoria.toString());
    }

    if (filtros.cveOoad != null) {
      params = params.set('cveOoad', filtros.cveOoad.toString());
    }

    if (filtros.cveZona != null) {
      params = params.set('cveZona', filtros.cveZona.toString());
    }

    if (filtros.cveEspecialidad != null) {
      params = params.set('cveEspecialidad', filtros.cveEspecialidad.toString());
    }

    if (filtros.cveCategoria != null) {
      params = params.set('cveCategoria', filtros.cveCategoria.toString());
    }

    if (filtros.numPlaza?.trim()) {
      params = params.set('numPlaza', filtros.numPlaza.trim());
    }

    if (filtros.cveUnidad != null) {
      params = params.set('cveUnidad', filtros.cveUnidad.toString());
    }

    return this.http.get(ruta, {
      params,
      responseType: 'blob'
    }
    ).pipe(
        catchError(this.handleError)
    );

  }


  consultarLstReportes(filtros: FiltrosReportePlaza = {}): Observable<HttpRespuesta<Paginado<ReportePlazas>>> {
    let params = new HttpParams();

    if (filtros.idConvocatoria != null) {
      params = params.set('idConvocatoria', filtros.idConvocatoria.toString());
    }

    if (filtros.cveOoad != null) {
      params = params.set('cveOoad', filtros.cveOoad.toString());
    }

    if (filtros.cveZona != null) {
      params = params.set('cveZona', filtros.cveZona.toString());
    }

    if (filtros.cveEspecialidad != null) {
      params = params.set('cveEspecialidad', filtros.cveEspecialidad.toString());
    }

    if (filtros.cveCategoria != null) {
      params = params.set('cveCategoria', filtros.cveCategoria.toString());
    }

    if (filtros.numPlaza?.trim()) {
      params = params.set('numPlaza', filtros.numPlaza.trim());
    }

    if (filtros.cveUnidad != null) {
      params = params.set('cveUnidad', filtros.cveUnidad.toString());
    }
    if (filtros.page != null) {
      params = params.set('page', filtros.page.toString());
    }

    if (filtros.size != null) {
      params = params.set('size', filtros.size.toString());
    }

      return this.http.get<HttpRespuesta<Paginado<ReportePlazas>>>(
        `${this.URL_BASE}administracionPlazas/busquedaPlazasFiltro`,
        { params }
      ).pipe(
          catchError(this.handleError)
      );
    }

  private handleError(error: ResponseGeneral) {

      if (!error.exito) {

        console.log("Error: " + error.mensaje ? error.mensaje : '. Contácte al administrador');
        // Return an observable with a user-facing error message.

      }
      return throwError(error);
    }

}
