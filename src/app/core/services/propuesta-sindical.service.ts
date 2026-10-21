import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, map, Observable, throwError} from 'rxjs';
import {ConsultaPropuestaSindicalResponse} from '@models/propuestaSindical.interface';
import {environment} from '@env/environment.development';
import {HttpRespuesta} from '@models/http-respuesta.interface';
import {ResponseGeneral} from '@models/responseGeneral';
import { PaginadoReporteFiltros } from '@models/reporte-propuesta.interface';

export interface FiltrosReporte extends FiltrosPrincipales {
  page?: number| string | null;
  size?: number| string | null;
}

export interface FiltrosPrincipales {
  idConvocatoria?: number | null;
  cveOoad?: number | null;
  numPlaza?: string | null;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  estatusPropuesta?: string | null;
}


@Injectable({
  providedIn: 'root'
})
export class PropuestaSindicalService {
  private readonly URL_BASE = `${environment.api.apiSindical}`;
  private readonly URL_DOCUMENTOS = `${environment.api.apiDocumentos}`;
  private readonly V = "v1/";
  header = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
  });



  constructor(private http: HttpClient) {
  }

  consultaPropuesta(matriculaFolio: string): Observable<HttpRespuesta<ConsultaPropuestaSindicalResponse>> {

    let parametro = new HttpParams();
    parametro = parametro.set('matriculaFolio', matriculaFolio);

    const ruta = `${this.URL_BASE}${this.V}propuesta-sindical/aspirante-por-matriculaFolio`;

    return this.http.get<HttpRespuesta<ConsultaPropuestaSindicalResponse>>(ruta, {headers: this.header, params: parametro}).pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response
      }),
    );
  }

  nuevaPropuesta(idAsignacion: number, idSeccionSindical: number): Observable<HttpRespuesta<any>> {

    const ruta = `${this.URL_BASE}${this.V}propuesta-sindical/generar-propuesta`;

    return this.http.post<HttpRespuesta<any>>(ruta, {idAsignacion, idSeccionSindical}, {headers: this.header}).pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response
      }),
    );
  }

  cancelarPropuesta(idPropuestaSindical: number): Observable<HttpRespuesta<any>> {

    let parametro = new HttpParams();
    parametro = parametro.set('idPropuestaSindical', idPropuestaSindical);
    const options = {headers: this.header, params: parametro};
    const ruta = `${this.URL_BASE}${this.V}propuesta-sindical/cancelar-propuesta`;


    return this.http.put(ruta, {}, options).pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response
      }),
    );
  }


  generarPdfPropuesta(idPropuestaSindical: number): Observable<HttpRespuesta<any>> {

    let parametro = new HttpParams();
    parametro = parametro.set('idPropuestaSindical', idPropuestaSindical);
    const options = {headers: this.header, params: parametro};
    const ruta = `${this.URL_BASE}${this.V}propuesta-sindical/imprimir-propuesta-sindical`;


    return this.http.get(ruta, options).pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response
      }),
    );
  }

  actualizarFotogradia(idParticipacion: number, refGuidFotografia: string): Observable<HttpRespuesta<any>>{


    const options = {headers: this.header};
    const ruta = `${this.URL_BASE}${this.V}propuesta-sindical/actualizar-fotografia`;

    return this.http.put(ruta, {idParticipacion,refGuidFotografia}, options).pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response
      }),
    );


  }

  consultarPropuestas(filtros: FiltrosReporte = {}): Observable<HttpRespuesta<PaginadoReporteFiltros>>{

    const ruta = `${this.URL_BASE}${this.V}propuesta-sindical/reporte-propuestas`;
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

    if (filtros.estatusPropuesta?.trim()) {
      params = params.set('estatusPropuesta', filtros.estatusPropuesta.trim());
    }

    if (filtros.fechaInicio?.trim()) {
      params = params.set('fechaInicio', filtros.fechaInicio.trim());
    }

    if (filtros.fechaFin?.trim()) {
      params = params.set('fechaFin', filtros.fechaFin.trim());
    }

    if (filtros.page != null) {
      params = params.set('page', filtros.page);
    }

    if (filtros.size != null) {
      params = params.set('size', filtros.size);
    }

    return this.http.get<HttpRespuesta<PaginadoReporteFiltros>>(
      `${ruta}`,
      { params }
    ).pipe(
        catchError(this.handleError)
    );
  }

  exportarExcel(filtros: FiltrosPrincipales = {}): Observable<Blob>{
    const ruta = `${this.URL_BASE}${this.V}propuesta-sindical/reporte-propuestas/excel`;
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

    if (filtros.estatusPropuesta?.trim()) {
      params = params.set('estatusPropuesta', filtros.estatusPropuesta.trim());
    }

    if (filtros.fechaInicio?.trim()) {
      params = params.set('fechaInicio', filtros.fechaInicio.trim());
    }

    if (filtros.fechaFin?.trim()) {
      params = params.set('fechaFin', filtros.fechaFin.trim());
    }

    return this.http.get(ruta, {
      params,
      responseType: 'blob'
    }

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
