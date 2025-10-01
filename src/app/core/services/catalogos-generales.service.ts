/**
 * Develop: Ameyalli Victoria S
 * 2025
 */
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {CatDocVerifResponse, CatPaisResponse, CatPerfilResponse, CatSubperfilResponse} from '@models/catalogoGeneral';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from '../../../environments/environment.development';
import {AlertService} from '../services/alert.service';


@Injectable({
     providedIn: 'root'
 })
 export class CatalogosGeneralesService {
     private VERSION_API:string  = '/v1/';
     private serverEndPointURL = `${environment.api.apiCatalogos + this.VERSION_API+'catalogos'}`;
     protected _alertService: AlertService  ;
     protected http: HttpClient;
     header = new HttpHeaders({
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
         return this.http.get<CatPerfilResponse>(this.serverEndPointURL + '/perfiles-medicos', { headers: this.header }).pipe(
             catchError(this.handleError),
             map((response: CatPerfilResponse) => {
                 return response;
             })
         );
     }

     getLstSubPerfil(): Observable<CatSubperfilResponse> {
        return this.http.get<CatSubperfilResponse>(this.serverEndPointURL + '/subperfiles-medicos/perfil/3', { headers: this.header }).pipe(
            catchError(this.handleError),
            map((response: CatSubperfilResponse) => {
                return response;
            })
        );
    }


    getLstPais(): Observable<CatPaisResponse> {
        return this.http.get<CatPaisResponse>(this.serverEndPointURL + '/paises', { headers: this.header }).pipe(
            catchError(this.handleError),
            map((response: CatPaisResponse) => {
                return response;
            })
        );
    }

    getLstDocumentosVerificacion(): Observable<CatDocVerifResponse> {
        return this.http.get<CatDocVerifResponse>(this.serverEndPointURL + '/documentos-verificacion', { headers: this.header }).pipe(
            catchError(this.handleError),
            map((response: CatDocVerifResponse) => {
                return response;
            })
        );
    }



     private handleError(error: HttpErrorResponse) {

        if (error.status) {
        //this._alertService?.error("Error "+error.status +'. Contácte al administrador');
        console.log("Error "+error.status +'. Endpoint: '+error.url+'. Contácte al administrador');
         // Return an observable with a user-facing error message.
        }
         return throwError(error);
     }


 }
