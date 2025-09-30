/**
 * Develop: Ameyalli Victoria S
 * 2025
 */
 import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
 import { Injectable } from '@angular/core';
import { CatPerfil, CatPerfilResponse } from '@models/catalogoGeneral';
 import { Observable, throwError } from 'rxjs';
 import { catchError, map } from 'rxjs/operators';
 import { environment } from '../../../environments/environment.development';

 
 
 @Injectable({
     providedIn: 'root'
 })
 export class CatalogosGeneralesService {
     private VERSION_API:string  = '/v1/';
     private serverEndPointURL = `${environment.apiCatalogos + this.VERSION_API+'catalogos'}`;
 
     header = new HttpHeaders({
         'Content-Type': 'application/json',
         'Access-Control-Allow-Origin': '*',
         'Access-Control-Allow-Headers': 'Content-Type',
         'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
     });
 
     constructor(private http: HttpClient) { }
 
 
     /**Obtener Listado de Perfiles */
     getLstPerfil(): Observable<CatPerfilResponse> {
         return this.http.get<CatPerfilResponse>(this.serverEndPointURL + '/perfiles-medicos', { headers: this.header }).pipe(
             catchError(this.handleError),
             map((response: CatPerfilResponse) => {
                 return response;
             })
         );
     }
 
 
  
     private handleError(error: HttpErrorResponse) {
         console.log("Error: ", error);
         // Return an observable with a user-facing error message.
         return throwError(error);
     }
 
 
 }
 