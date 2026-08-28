/**
 * Develop: Ameyalli Victoria S
 * 2025
 */
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  CatDocVerifResponse,
  CatPaisResponse,
  CatPerfilResponse,
  CatSubperfilResponse,
  CatTipoConvocatoria,
  CatTipoConvocatoriaResponse
} from '@models/catalogoGeneral';
import { HttpRespuesta } from '@models/http-respuesta.interface';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '@env/environment.development';
import { AlertService } from '@services/alert.service';
import { Convocatoria, ConvocatoriaActiva } from '@models/convocatoria.interface';
import { Especialidades } from '@models/especialidad';
import { TipoDocumentoEspecialidad } from '@models/tipo-documento-especialidad.interface';
import { EstatusPlaza } from '@models/estatusPlaza';
import { CategoriaPlaza } from '@models/cat-categoria.interface';
import { TipoUnidad } from '@models/cat-tipo-unidad.interface';

@Injectable({
  providedIn: 'root'
})
export class CatalogosGeneralesService {
  private readonly VERSION_API: string = '/v1/';
  private readonly serverEndPointURLCatalogos = `${environment.api.apiCatalogos + this.VERSION_API + 'catalogos'}`;
  private readonly serverEndPointURLCatalogos1 = `${environment.api.apiConvocatoria + '/catalogos'}`;
  private readonly serverEndPointURLVerificacionDocs = `${environment.api.apiConvocatoria + '/verificacion/catalogos'}`;
  protected _alertService: AlertService;
  protected http: HttpClient;
  header: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
  });

  constructor() {
    this.http = inject(HttpClient);
    this._alertService = inject(AlertService);

  }


  /**Obtener Listado de Perfiles */
  getLstPerfil(): Observable<CatPerfilResponse> {
    return this.http.get<CatPerfilResponse>(this.serverEndPointURLCatalogos + '/perfiles-medicos', { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: CatPerfilResponse) => {
        return response;
      })
    );
  }

  getLstSubPerfil(idPerfil: number = 6): Observable<CatSubperfilResponse> {
    return this.http.get<CatSubperfilResponse>(this.serverEndPointURLCatalogos + `/subperfiles-medicos/perfil/${idPerfil}`, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: CatSubperfilResponse) => {
        return response;
      })
    );
  }

  getLstTiposConvocatoria(): Observable<CatTipoConvocatoriaResponse> {
    return this.http.get<CatTipoConvocatoriaResponse>(this.serverEndPointURLCatalogos + '/tipoconvocatoria', { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: CatTipoConvocatoriaResponse) => {
        return response;
      })
    );
  }

  getTipoConvocatoriaById(idTipoConvocatoria: number): Observable<HttpRespuesta<CatTipoConvocatoria>> {
    return this.http.get<HttpRespuesta<CatTipoConvocatoria>>(`${this.serverEndPointURLCatalogos}/tipoconvocatoria/${idTipoConvocatoria}`, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<CatTipoConvocatoria>) => {
        return response;
      })
    );
  }


  getLstPais(): Observable<CatPaisResponse> {
    return this.http.get<CatPaisResponse>(this.serverEndPointURLCatalogos + '/paises', { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: CatPaisResponse) => {
        return response;
      })
    );
  }

  getLstDocumentosVerificacion(): Observable<CatDocVerifResponse> {
    return this.http.get<CatDocVerifResponse>(this.serverEndPointURLCatalogos + '/documentos-verificacion', { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: CatDocVerifResponse) => {
        return response;
      })
    );
  }


  getLstSexos(): Observable<HttpRespuesta<any>> {
    return this.http.get<HttpRespuesta<any>>(this.serverEndPointURLCatalogos + '/sexos', { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<any>) => {
        return response;
      })
    );
  }

  getLstLugarNacimiento(): Observable<HttpRespuesta<any>> {
    return this.http.get<HttpRespuesta<any>>(this.serverEndPointURLCatalogos + '/lugares-nacimiento', { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<any>) => {
        return response;
      })
    );
  }

  getLstEstadosCiviles(): Observable<HttpRespuesta<any>> {
    return this.http.get<HttpRespuesta<any>>(this.serverEndPointURLCatalogos + '/estados-civiles', { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<any>) => {
        return response;
      })
    );
  }


  getLstEstadosByPais(idPais: number): Observable<HttpRespuesta<any>> {
    return this.http.get<HttpRespuesta<any>>(`${this.serverEndPointURLCatalogos}/estados/pais/${idPais}`, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<any>) => {
        return response;
      })
    );
  }

  getLstDelegacionesMunicipiosByEstado(idEstado: number): Observable<HttpRespuesta<any>> {
    return this.http.get<HttpRespuesta<any>>(`${this.serverEndPointURLCatalogos}/delegaciones-municipios/estado/${idEstado}`, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<any>) => {
        return response;
      })
    );
  }

  getLstColoniasByDelegacion(idMunicipio: number): Observable<HttpRespuesta<any>> {
    return this.http.get<HttpRespuesta<any>>(`${this.serverEndPointURLCatalogos}/colonias/delegacion/${idMunicipio}`, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<any>) => {
        return response;
      })
    );
  }

  getLstOOADS(): Observable<HttpRespuesta<any>> {
    return this.http.get<HttpRespuesta<any>>(`${this.serverEndPointURLCatalogos}/ooads`, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<any>) => {
        return response;
      })
    );
  }


  getLstZonas(ooad: number): Observable<HttpRespuesta<any>> {
    return this.http.get<HttpRespuesta<any>>(`${this.serverEndPointURLCatalogos}/zonas/${ooad}`, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<any>) => {
        return response;
      })
    );
  }

  getZonas(cveOoad: string): Observable<HttpRespuesta<any>> {
    return this.http.get<HttpRespuesta<any>>(`${this.serverEndPointURLCatalogos}/zonas/${cveOoad}`, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<any>) => {
        return response;
      })
    );
  }

  getLstCodigosPostales(cp: number): Observable<HttpRespuesta<any>> {
    return this.http.get<HttpRespuesta<any>>(`${this.serverEndPointURLCatalogos}/codigos-postales/buscar/${cp}`, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<any>) => {
        return response;
      })
    );
  }

  getLstTiposDocumentos(): Observable<HttpRespuesta<TipoDocumentoEspecialidad[]>> {
    return this.http.get<HttpRespuesta<TipoDocumentoEspecialidad[]>>(this.serverEndPointURLCatalogos + '/tiposdocumento-especialidad', { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<TipoDocumentoEspecialidad[]>) => {
        return response;
      })
    );
  }

  getLstEspecialidades(): Observable<HttpRespuesta<any>> {
    return this.http.get<HttpRespuesta<any>>(this.serverEndPointURLCatalogos + '/especialidades', { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<any>) => {
        return response;
      })
    );
  }

  getCollEspecialidades(): Observable<any> {
    return this.http.get<any>(this.serverEndPointURLCatalogos + '/especialidades', { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response;
      })
    );
  }

  getLstEstatusVerificacion(): Observable<HttpRespuesta<any>> {
    return this.http.get<HttpRespuesta<any>>(this.serverEndPointURLVerificacionDocs + '/estatusVerificacion', { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<any>) => {
        return response;
      })
    );
  }

  getLstDiasSemana(): Observable<HttpRespuesta<any>> {
    return this.http.get<HttpRespuesta<any>>(this.serverEndPointURLCatalogos + '/diasSemana', { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<any>) => {
        return response;
      })
    );
  }


  getLstRegimen(): Observable<HttpRespuesta<any>> {
    return this.http.get<HttpRespuesta<any>>(this.serverEndPointURLCatalogos1 + '/regimen', { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<any>) => {
        return response;
      })
    );
  }

  getLstBono(): Observable<HttpRespuesta<any>> {
    return this.http.get<HttpRespuesta<any>>(this.serverEndPointURLCatalogos1 + '/bono-dificil-cobertura', { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<any>) => {
        return response;
      })
    );
  }

  getLstPreguntas(): Observable<HttpRespuesta<any>> {
    return this.http.get<HttpRespuesta<any>>(this.serverEndPointURLCatalogos1 + '/preguntas-frecuentes', { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<any>) => {
        return response;
      })
    );
  }


  getDocumentos(ooad: string, zona: number): Observable<any> {
    return this.http.get<HttpRespuesta<any>>(this.serverEndPointURLCatalogos1 + '/documentos-ooad/' + ooad + `/${zona}`, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<any>) => {
        return response;
      })
    );
  }

  getTipoAsistencia(): Observable<any> {
    return this.http.get<HttpRespuesta<any>>(this.serverEndPointURLCatalogos + '/tipoAsistencia', { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<any>) => {
        return response;
      })
    );
  }

  getTurno(): Observable<any> {
    return this.http.get<HttpRespuesta<any>>(this.serverEndPointURLCatalogos + '/turno', { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<any>) => {
        return response;
      })
    );
  }

  getConvocatorias(): Observable<any> {
    return this.http.get<HttpRespuesta<any>>(this.serverEndPointURLCatalogos + '/convocatorias', { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<any>) => {
        return response;
      })
    );
  }
  getSeccionSindical(ooad: string): Observable<any> {
    return this.http.get<HttpRespuesta<any>>(`${this.serverEndPointURLCatalogos}/seccion-sindical/ooad/${ooad}`, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<any>) => {
        return response;
      })
    );
  }

  getMotivosRechazo(): Observable<any> {
    return this.http.get<HttpRespuesta<any>>(this.serverEndPointURLCatalogos + '/motivoRechazo', { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<any>) => {
        return response;
      })
    );
  }

  getLsConvocatorias(): Observable<HttpRespuesta<Convocatoria[]>> {
    return this.http.get<HttpRespuesta<Convocatoria[]>>(this.serverEndPointURLCatalogos + '/convocatorias', { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<Convocatoria[]>) => {
        return response;
      })
    );
  }

  getConvocatoriaActiva(): Observable<HttpRespuesta<ConvocatoriaActiva | undefined>> {
    return this.http.get<HttpRespuesta<ConvocatoriaActiva | undefined>>(this.serverEndPointURLCatalogos + '/convocatorias/activa', { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<ConvocatoriaActiva | undefined>) => {
        return response;
      })
    );
  }

  getLsEspecialidades(): Observable<Especialidades[]> {
    return this.http.get<Especialidades[]>(this.serverEndPointURLCatalogos + '/especialidades', { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: Especialidades[]) => {
        return response;
      })
    );
  }

  getLstEstatusPlaza(): Observable<HttpRespuesta<EstatusPlaza[]>> {
    return this.http.get<HttpRespuesta<EstatusPlaza[]>>(this.serverEndPointURLCatalogos + '/plazas/estatus-plaza', { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<EstatusPlaza[]>) => {
        return response;
      })
    );
  }

  getLstCategorias(): Observable<HttpRespuesta<CategoriaPlaza[]>>{
    return this.http.get<HttpRespuesta<CategoriaPlaza[]>>(this.serverEndPointURLCatalogos + '/plazas/categorias', { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<CategoriaPlaza[]>) => {
        return response;
      })
    );
  }

  getLstTiposUnidad(): Observable<HttpRespuesta<TipoUnidad[]>>{
    return this.http.get<HttpRespuesta<TipoUnidad[]>>(this.serverEndPointURLCatalogos + '/plazas/tipos-unidad', { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<TipoUnidad[]>) => {
        return response;
      })
    );
  }



  private handleError(error: HttpErrorResponse) {

    if (error.status) {
      //this._alertService?.error("Error "+error.status +'. Contácte al administrador');
      console.log("Error " + error.status + '. Endpoint: ' + error.url + '. Contácte al administrador');
      // Return an observable with a user-facing error message.
    }
    return throwError(error);
  }


}
