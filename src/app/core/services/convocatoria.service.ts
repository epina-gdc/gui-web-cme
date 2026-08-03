import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AspiranteRequest, InteresLaboralRequest } from '@models/aspirante';
import { DataFotografia } from '@models/fotografia';
import { DatosDocumentoResponse } from '@models/datosDocumento';
import { ContactoRequest, DataContacto } from '@models/datosContacto';
import {
  Convocatoria,
  ConvocatoriaDetalle,
  ConvocatoriaPermisoSustitucion,
  ConvocatoriaRegistroRequest
} from '@models/convocatoria.interface';
import { DataDomicilio, ResidenciaRequest } from '@models/datosDomicilio';
import { AlertService } from './alert.service';
import { dataGenerales, DatosGeneralesRequest } from '@models/datosGenerales';
import { ResponseGeneral } from '@models/responseGeneral';
import { SolicitudGuardarDocumentacion } from '@models/solicitud-guardar-documentacion.interface';
import { HttpRespuesta } from '@models/http-respuesta.interface';
import { BusquedaPermisoEspecifico, BusquedaPermisoEspecificoResult } from '@models/asignacion-sustitucion.interface';
import {
  FiltrosOfertaLaboralRequest,
  HorarioPlazaCatalogo,
  MarcaOcupacionCatalogo,
  SedeOoadCatalogo,
  TurnoPlazaCatalogo,
  UnidadPlazaCatalogo
} from '@models/plaza-catalogos.interface';

@Injectable({
  providedIn: 'root'
})
export class ConvocatoriaService {
  private readonly serverEndPointURLConvocatoria = `${environment.api.apiConvocatoria}`;
  private readonly serverEndPointURLDocumento = `${environment.api.apiDocumentos}`;
  private readonly VERSION_API: string = '/v1/';
  private readonly CONFIGURACION = 'configuracion';
  private readonly serverEndPointURLAsignacionSituacion = `${environment.api.apiConvocatoria}${this.VERSION_API}${this.CONFIGURACION}`;
  http: HttpClient = inject(HttpClient);
  _alertServices: AlertService = inject(AlertService);

  header: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
  });

  headers2: HttpHeaders = new HttpHeaders({

    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST',

  });


  getDatosResidencia(idUsuario: number): Observable<any> {
    return this.http.get<DataDomicilio>(`${this.serverEndPointURLConvocatoria}/aspirante/datos-residencia/${idUsuario}`, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: DataDomicilio) => {
        return response;
      })
    );
  }

  getDatosDependientes(idUsuario: number): Observable<any> {
    return this.http.get<any>(`${this.serverEndPointURLConvocatoria}/aspirante/datos-dependientes/${idUsuario}`, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response;
      })
    );
  }


  getDatosEmpleo(idUsuario: number): Observable<any> {
    return this.http.get<any>(`${this.serverEndPointURLConvocatoria}/aspirante/datos-empleo/${idUsuario}`, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response;
      })
    );
  }

  getDatosGenerales(idUsuario: number): Observable<dataGenerales> {
    return this.http.get<dataGenerales>(`${this.serverEndPointURLConvocatoria}/aspirante/datos-generales/${idUsuario}`, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: dataGenerales) => {
        return response;
      })
    );
  }


  getDatosContacto(idUsuario: number): Observable<any> {
    return this.http.get<DataContacto>(`${this.serverEndPointURLConvocatoria}/aspirante/datos-contacto/${idUsuario}`, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: DataContacto) => {
        return response;
      })
    );
  }


  getDatosInteresLaboral(idUsuario: number): Observable<any> {
    return this.http.get<any>(`${this.serverEndPointURLConvocatoria}/aspirante/datos-interes-laboral/${idUsuario}`, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response;
      })
    );
  }

  getDatosFotografia(idUsuario: number): Observable<DataFotografia> {
    return this.http.get<any>(`${this.serverEndPointURLConvocatoria}/aspirante/datos-fotografia/${idUsuario}`, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: DataFotografia) => {
        return response;
      })
    );
  }


  getDatosDocumentos(idUsuario: number): Observable<any> {
    return this.http.get<DatosDocumentoResponse>(`${this.serverEndPointURLConvocatoria}/aspirante/datos-documentos/${idUsuario}`, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: DatosDocumentoResponse) => {
        return response;
      })
    );
  }

  getDatosDocumentosEscolares(idUsuario: number): Observable<any> {
    return this.http.get<DatosDocumentoResponse>(`${this.serverEndPointURLConvocatoria}/aspirante/datos-documentos-escolaridad/${idUsuario}`, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: DatosDocumentoResponse) => {
        return response;
      })
    );
  }


  getVerificacionAspirante(idUsuario: number): Observable<any> {
    return this.http.get<any>(`${this.serverEndPointURLConvocatoria}/verificacion/aspirante/${idUsuario}`, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response;
      })
    );
  }

  getEvaluacionDocumentos(idUsuario: number): Observable<any> {
    let ruta = `${this.serverEndPointURLConvocatoria}/verificacion/aspirante/evaluacion-documentos/${idUsuario}`;
    return this.http.get<any>(ruta, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response;
      })
    );
  }

  guardarDatosGenerales(aspirante: DatosGeneralesRequest): Observable<any> {
    let ruta = `${this.serverEndPointURLConvocatoria}/aspirante/datos-generales`;
    return this.http.post<any>(ruta, aspirante, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response;
      })
    );
  }

  guardarDatosDocumentosEscolares(solicitud: SolicitudGuardarDocumentacion): Observable<any> {
    let ruta = `${this.serverEndPointURLConvocatoria}/aspirante/datos-documentos-escolaridad`;
    return this.http.post<any>(ruta, solicitud, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response;
      })
    );
  }

  terminarRegistro(solicitud: SolicitudGuardarDocumentacion): Observable<any> {
    let ruta = `${this.serverEndPointURLConvocatoria}/aspirante/finalizar-datos-documentos-escolaridad`;
    return this.http.post<any>(ruta, solicitud, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response;
      })
    );
  }


  guardarVerificacionAspirante(aspirante: AspiranteRequest): Observable<any> {
    let ruta = `${this.serverEndPointURLConvocatoria}/verificacion/aspirante'`;
    return this.http.post<any>(ruta, aspirante, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response;
      })
    );
  }

  guardarFoto(foto: any): Observable<any> {
    let ruta = `${this.serverEndPointURLConvocatoria}/aspirante/datos-fotografia`;
    return this.http.post<any>(ruta, foto, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response;
      })
    );
  }


  guardarDocumento(documento: any): Observable<any> {
    let ruta = `${this.serverEndPointURLConvocatoria}/aspirante/datos-documentos`
    return this.http.post<any>(ruta, documento, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response
      }),
    )


  }

  guardarInteresLaboral(interes: InteresLaboralRequest): Observable<any> {
    let ruta = `${this.serverEndPointURLConvocatoria}/aspirante/datos-interes-laboral`
    return this.http.post<any>(ruta, interes, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response
      }),
    )


  }

  guardarContacto(datosContacto: ContactoRequest): Observable<any> {
    let ruta = `${this.serverEndPointURLConvocatoria}/aspirante/datos-contacto`
    return this.http.post<any>(ruta, datosContacto, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response
      }),
    )


  }

  guardarResidencia(residencia: ResidenciaRequest): Observable<any> {
    let ruta = `${this.serverEndPointURLConvocatoria}/aspirante/datos-residencia`
    return this.http.post<any>(ruta, residencia, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response
      }),
    )


  }

  consultarPlazas(filtros: FiltrosOfertaLaboralRequest, parameters: any): Observable<any> {

    const { page, size, sort } = parameters;

    let parametros = new HttpParams();
    parametros = parametros.set('page', page);
    parametros = parametros.set('size', size);
    parametros = parametros.set('sort', sort);


    const ruta = `${this.serverEndPointURLConvocatoria}/plazas/consultar`;
    return this.http.post<any>(ruta, filtros, { headers: this.header, params: parametros }).pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response
      }),
    )
  }

  consultarTotales(
    filtros: Omit<FiltrosOfertaLaboralRequest, 'idUsuario'>
  ): Observable<HttpRespuesta<any>> {

    return this.http.post<HttpRespuesta<any>>(`${this.serverEndPointURLConvocatoria}/plazas/consultar/totales`, filtros).pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response
      }),
    )
  }

  consultarTotalesFavoritos(
    filtros: FiltrosOfertaLaboralRequest
  ): Observable<HttpRespuesta<any>> {

    return this.http.post<HttpRespuesta<any>>(`${this.serverEndPointURLConvocatoria}/plazas-favoritas/consultar/totales`, filtros).pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response
      }),
    )
  }

  agregarFavorito(
    datosPlaza: {
      idUsuario: number,
      idPlaza: number,
      esFavorita: boolean
    }
  ): Observable<HttpRespuesta<any>> {
    return this.http.post<HttpRespuesta<any>>(`${this.serverEndPointURLConvocatoria}/plazas-favoritas/guardar`, datosPlaza).pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response
      }),
    )
  }

  consultarDetalleConvocatoria(idConvocatoria: number): Observable<HttpRespuesta<ConvocatoriaDetalle>> {
    const ruta = `${this.serverEndPointURLConvocatoria}${this.VERSION_API}convocatoria/${idConvocatoria}`;
    return this.http.get<HttpRespuesta<ConvocatoriaDetalle>>(ruta, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<ConvocatoriaDetalle>) => {
        return response;
      })
    );
  }

  guardarConvocatoria(request: ConvocatoriaRegistroRequest): Observable<HttpRespuesta<ConvocatoriaDetalle>> {
    const ruta = `${this.serverEndPointURLConvocatoria}${this.VERSION_API}convocatoria`;
    return this.http.post<HttpRespuesta<ConvocatoriaDetalle>>(ruta, request, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<ConvocatoriaDetalle>) => {
        return response;
      })
    );
  }

  actualizarConvocatoria(idConvocatoria: number, request: ConvocatoriaRegistroRequest): Observable<HttpRespuesta<ConvocatoriaDetalle>> {
    const ruta = `${this.serverEndPointURLConvocatoria}${this.VERSION_API}convocatoria/${idConvocatoria}`;
    return this.http.put<HttpRespuesta<ConvocatoriaDetalle>>(ruta, request, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<ConvocatoriaDetalle>) => {
        return response;
      })
    );
  }


  consultarFavoritos(filtros: FiltrosOfertaLaboralRequest, parameters: any): Observable<any> {

    const { page, size, sort } = parameters;

    let parametros = new HttpParams();
    parametros = parametros.set('page', page);
    parametros = parametros.set('size', size);
    parametros = parametros.set('sort', sort);


    const ruta = `${this.serverEndPointURLConvocatoria}/plazas-favoritas/consultar`;
    return this.http.post<any>(ruta, filtros, { headers: this.header, params: parametros }).pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response
      }),
    )
  }

  getUnidadesOfertaLaboral(cveEspecialidad: string, cveOoad: string): Observable<HttpRespuesta<UnidadPlazaCatalogo[]>> {
    let parametros = new HttpParams();
    parametros = parametros.set('cveEspecialidad', cveEspecialidad);
    parametros = parametros.set('cveOoad', cveOoad);

    return this.http.get<HttpRespuesta<UnidadPlazaCatalogo[]>>(
      `${this.serverEndPointURLConvocatoria}/plazas/catalogos/unidad-por-ooad`,
      {headers: this.header, params: parametros}
    ).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<UnidadPlazaCatalogo[]>) => response)
    );
  }

  getMarcasOcupacionOfertaLaboral(cveEspecialidad: string): Observable<HttpRespuesta<MarcaOcupacionCatalogo[]>> {
    const parametros = new HttpParams().set('cveEspecialidad', cveEspecialidad);

    return this.http.get<HttpRespuesta<MarcaOcupacionCatalogo[]>>(
      `${this.serverEndPointURLConvocatoria}/plazas/catalogos/marca-ocupacion-por-especialidad`,
      {headers: this.header, params: parametros}
    ).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<MarcaOcupacionCatalogo[]>) => response)
    );
  }

  getTurnosOfertaLaboral(cveEspecialidad: string): Observable<HttpRespuesta<TurnoPlazaCatalogo[]>> {
    const parametros = new HttpParams().set('cveEspecialidad', cveEspecialidad);

    return this.http.get<HttpRespuesta<TurnoPlazaCatalogo[]>>(
      `${this.serverEndPointURLConvocatoria}/plazas/catalogos/turno-por-especialidad`,
      {headers: this.header, params: parametros}
    ).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<TurnoPlazaCatalogo[]>) => response)
    );
  }

  getHorariosOfertaLaboral(cveEspecialidad: string, cveTurno: number): Observable<HttpRespuesta<HorarioPlazaCatalogo[]>> {
    let parametros = new HttpParams();
    parametros = parametros.set('cveEspecialidad', cveEspecialidad);
    parametros = parametros.set('cveTurno', cveTurno);

    return this.http.get<HttpRespuesta<HorarioPlazaCatalogo[]>>(
      `${this.serverEndPointURLConvocatoria}/plazas/catalogos/horario-por-turno`,
      {headers: this.header, params: parametros}
    ).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<HorarioPlazaCatalogo[]>) => response)
    );
  }

  getSedesOfertaLaboral(cvesOoad: string[] = []): Observable<HttpRespuesta<SedeOoadCatalogo[]>> {
    let parametros = new HttpParams();

    cvesOoad
      .filter(cveOoad => !!cveOoad)
      .forEach(cveOoad => parametros = parametros.append('cve_ooad', cveOoad));

    return this.http.get<HttpRespuesta<SedeOoadCatalogo[]>>(
      `${this.serverEndPointURLConvocatoria}/plazas/catalogos/sedes`,
      {headers: this.header, params: parametros}
    ).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<SedeOoadCatalogo[]>) => response)
    );
  }

  getSedesPdfOfertaLaboral(cvesOoad: string[] = []): Observable<Blob> {
    let parametros = new HttpParams();

    cvesOoad
      .filter(cveOoad => !!cveOoad)
      .forEach(cveOoad => parametros = parametros.append('cve_ooad', cveOoad));

    return this.http.get(
      `${this.serverEndPointURLConvocatoria}/plazas/catalogos/sedes/pdf`,
      {
        headers: this.header.set('Accept', 'application/pdf'),
        params: parametros,
        responseType: 'blob'
      }
    ).pipe(
      catchError(this.handleError),
      map((response: Blob) => response)
    );
  }

  /**
   * 
   * Acceso al módulo Configuración de asignación por sustitución.
   * 
   */

  estadoGlobalConvocatoria(idConvocatoria: number): Observable<HttpRespuesta<ConvocatoriaPermisoSustitucion>> {
    let ruta = `${this.serverEndPointURLAsignacionSituacion}/convocatoriaEstado/${idConvocatoria}`;
    return this.http.get<HttpRespuesta<ConvocatoriaPermisoSustitucion>>(ruta, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<ConvocatoriaPermisoSustitucion>) => {
        return response;
      })
    );
  }

  actualizarPermisoGlobalConvocatoria(idConvocatoria: number, estatus: number): Observable<HttpRespuesta<ConvocatoriaPermisoSustitucion>> {
    let ruta = `${this.serverEndPointURLAsignacionSituacion}/limiteContratacion/${idConvocatoria}/estado/${estatus}`;
    return this.http.put<HttpRespuesta<ConvocatoriaPermisoSustitucion>>(ruta, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<ConvocatoriaPermisoSustitucion>) => {
        return response;
      })
    );
  }

  buscarPermisoEspecifico(buscar: BusquedaPermisoEspecifico): Observable<HttpRespuesta<BusquedaPermisoEspecificoResult>> {
    let ruta = `${this.serverEndPointURLAsignacionSituacion}/limiteContratacionEspecifico/buscar`;
    return this.http.post<HttpRespuesta<BusquedaPermisoEspecificoResult>>(ruta, buscar, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<BusquedaPermisoEspecificoResult>) => {
        return response;
      })
    );
  }

  activarDesactivarPermisoEspecifico(idPermisoSustitucion: number, estatus: number): Observable<HttpRespuesta<BusquedaPermisoEspecificoResult>> {
    let ruta = `${this.serverEndPointURLAsignacionSituacion}/limiteContratacionEspecifico/${idPermisoSustitucion}/estado/${estatus}`;
    return this.http.put<HttpRespuesta<BusquedaPermisoEspecificoResult>>(ruta, {}, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<BusquedaPermisoEspecificoResult>) => {
        return response;
      })
    );
  }

  lstContratacionesEspecificosDesativadas(idConvocatoria: number): Observable<HttpRespuesta<BusquedaPermisoEspecificoResult[]>> {
    let ruta = `${this.serverEndPointURLAsignacionSituacion}/listar/limitesDesactivados/${idConvocatoria}`;
    return this.http.get<HttpRespuesta<BusquedaPermisoEspecificoResult[]>>(ruta, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<BusquedaPermisoEspecificoResult[]>) => {
        return response;
      })
    );
  }

  private handleError(error: ResponseGeneral) {

    if (!error.exito) {
      this._alertServices.error("Error: " + error.mensaje ? error.mensaje : '. Contácte al administrador');
      console.log("Error: " + error.mensaje ? error.mensaje : '. Contácte al administrador');
      // Return an observable with a user-facing error message.

    }
    return throwError(error);
  }
}
