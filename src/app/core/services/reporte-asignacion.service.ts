import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { HttpRespuesta } from '@models/http-respuesta.interface';
import {
  ReporteAsignacionFiltro,
  ReporteAsignacionPaginado,
  ReporteAsignacionRespuestaAlterna,
} from '@models/reporte-asignacion.interface';
import { catchError, map, Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ReporteAsignacionService {
  private readonly version = '/v1/';
  private readonly urlReporte = `${environment.api.apiAsignacionReporte}${this.version}reportes-asignacion`;
  private readonly http: HttpClient = inject(HttpClient);

  private readonly header = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
  });

  consultarReporte(filtros: ReporteAsignacionFiltro): Observable<HttpRespuesta<ReporteAsignacionPaginado>> {
    return this.http.get<HttpRespuesta<ReporteAsignacionRespuestaAlterna>>(
      `${this.urlReporte}/listado`,
      { headers: this.header, params: this.crearParametros(filtros) }
    ).pipe(
      map((response: HttpRespuesta<ReporteAsignacionRespuestaAlterna>) => ({
        ...response,
        respuesta: this.normalizarPaginado(response.respuesta, filtros),
      })),
      catchError(this.handleError)
    );
  }

  exportarReporteGeneral(filtros: ReporteAsignacionFiltro): Observable<Blob> {
    return this.exportar(`${this.urlReporte}/general/excel`, filtros);
  }

  exportarReporteDetalle(filtros: ReporteAsignacionFiltro): Observable<Blob> {
    return this.exportar(`${this.urlReporte}/detalle/excel`, filtros);
  }

  private exportar(url: string, filtros: ReporteAsignacionFiltro): Observable<Blob> {
    return this.http.get(url, {
      headers: this.header,
      params: this.crearParametros(filtros),
      responseType: 'blob',
    }).pipe(
      catchError(this.handleError)
    );
  }

  private crearParametros(filtros: ReporteAsignacionFiltro): HttpParams {
    let params = new HttpParams();

    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return params;
  }

  private normalizarPaginado(
    data: ReporteAsignacionRespuestaAlterna | null | undefined,
    filtros: ReporteAsignacionFiltro
  ): ReporteAsignacionPaginado {
    const content = data?.content ?? data?.contenido ?? data?.registros ?? [];
    const totalElements = data?.page?.totalElements ?? data?.totalElements ?? data?.totalElementos ?? content.length;
    const size = data?.page?.size ?? data?.size ?? filtros.size ?? 10;
    const number = data?.page?.number ?? data?.number ?? data?.pagina ?? filtros.page ?? 0;
    const totalPages = data?.page?.totalPages ?? data?.totalPages ?? data?.totalPaginas ?? Math.ceil(totalElements / size);

    return {
      content,
      page: {
        size,
        number,
        totalElements,
        totalPages,
      },
    };
  }

  private handleError(error: HttpErrorResponse) {
    console.log('Error ' + error.status + '. Endpoint: ' + error.url + '. Contacte al administrador');
    return throwError(() => error);
  }
}