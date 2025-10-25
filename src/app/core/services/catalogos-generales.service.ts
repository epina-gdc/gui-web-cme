/**
 * Develop: Ameyalli Victoria S
 * 2025
 */
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {CatDocVerifResponse, CatPaisResponse, CatPerfilResponse, CatSubperfilResponse} from '@models/catalogoGeneral';
import {HttpRespuesta} from '@models/http-respuesta.interface';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from '@env/environment.development';
import {AlertService} from '@services/alert.service';

@Injectable({
  providedIn: 'root'
})
export class CatalogosGeneralesService {
  private readonly VERSION_API: string = '/v1/';
  private readonly serverEndPointURLCatalogos = `${environment.api.apiCatalogos + this.VERSION_API + 'catalogos'}`;
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
    return this.http.get<CatPerfilResponse>(this.serverEndPointURLCatalogos + '/perfiles-medicos', {headers: this.header}).pipe(
      catchError(this.handleError),
      map((response: CatPerfilResponse) => {
        return response;
      })
    );
  }

  getLstSubPerfil(): Observable<CatSubperfilResponse> {
    return this.http.get<CatSubperfilResponse>(this.serverEndPointURLCatalogos + '/subperfiles-medicos/perfil/3', {headers: this.header}).pipe(
      catchError(this.handleError),
      map((response: CatSubperfilResponse) => {
        return response;
      })
    );
  }


  getLstPais(): Observable<CatPaisResponse> {
    return this.http.get<CatPaisResponse>(this.serverEndPointURLCatalogos + '/paises', {headers: this.header}).pipe(
      catchError(this.handleError),
      map((response: CatPaisResponse) => {
        return response;
      })
    );
  }

  getLstDocumentosVerificacion(): Observable<CatDocVerifResponse> {
    return this.http.get<CatDocVerifResponse>(this.serverEndPointURLCatalogos + '/documentos-verificacion', {headers: this.header}).pipe(
      catchError(this.handleError),
      map((response: CatDocVerifResponse) => {
        return response;
      })
    );
  }


  getLstSexos(): Observable<HttpRespuesta<any>> {
    return this.http.get<HttpRespuesta<any>>(this.serverEndPointURLCatalogos + '/sexos', {headers: this.header}).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<any>) => {
        return response;
      })
    );
  }

  getLstLugarNacimiento(): Observable<HttpRespuesta<any>> {
    return this.http.get<HttpRespuesta<any>>(this.serverEndPointURLCatalogos + '/lugares-nacimiento', {headers: this.header}).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<any>) => {
        return response;
      })
    );
  }

  getLstEstadosCiviles(): Observable<HttpRespuesta<any>> {
    return this.http.get<HttpRespuesta<any>>(this.serverEndPointURLCatalogos + '/estados-civiles', {headers: this.header}).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<any>) => {
        return response;
      })
    );
  }


  getLstEstadosByPais(idPais: number): Observable<HttpRespuesta<any>> {
    return this.http.get<HttpRespuesta<any>>(`${this.serverEndPointURLCatalogos}/estados/pais/${idPais}`, {headers: this.header}).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<any>) => {
        return response;
      })
    );
  }

  getLstDelegacionesMunicipiosByEstado(idEstado: number): Observable<HttpRespuesta<any>> {
    return this.http.get<HttpRespuesta<any>>(`${this.serverEndPointURLCatalogos}/delegaciones-municipios/estado/${idEstado}`, {headers: this.header}).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<any>) => {
        return response;
      })
    );
  }

  getLstColoniasByDelegacion(idMunicipio: number): Observable<HttpRespuesta<any>> {
    return this.http.get<HttpRespuesta<any>>(`${this.serverEndPointURLCatalogos}/colonias/delegacion/${idMunicipio}`, {headers: this.header}).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<any>) => {
        return response;
      })
    );
  }

  getLstOOADS(): Observable<HttpRespuesta<any>> {
    return this.http.get<HttpRespuesta<any>>(`${this.serverEndPointURLCatalogos}/ooads`, {headers: this.header}).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<any>) => {
        return response;
      })
    );
  }


  getLstZonas(ooad: number): Observable<HttpRespuesta<any>> {
    return this.http.get<HttpRespuesta<any>>(`${this.serverEndPointURLCatalogos}/zonas/${ooad}`, {headers: this.header}).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<any>) => {
        return response;
      })
    );
  }

  getLstCodigosPostales(idMunicipio: number): Observable<HttpRespuesta<any>> {
    return this.http.get<HttpRespuesta<any>>(`${this.serverEndPointURLCatalogos}/codigos-postales/buscar/${idMunicipio}`, {headers: this.header}).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<any>) => {
        return response;
      })
    );
  }

  getLstTiposDocumentos(): Observable<HttpRespuesta<any>> {
    return this.http.get<HttpRespuesta<any>>(this.serverEndPointURLCatalogos + '/tiposdocumento-especialidad', {headers: this.header}).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<any>) => {
        return response;
      })
    );
  }

  getLstEspecialidades(): Observable<HttpRespuesta<any>> {
    return this.http.get<HttpRespuesta<any>>(this.serverEndPointURLCatalogos + '/especialidades', {headers: this.header}).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<any>) => {
        return response;
      })
    );
  }

  getLstDiasSemana(): Observable<HttpRespuesta<any>> {
    return this.http.get<HttpRespuesta<any>>(this.serverEndPointURLCatalogos + '/diasSemana', {headers: this.header}).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<any>) => {
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
