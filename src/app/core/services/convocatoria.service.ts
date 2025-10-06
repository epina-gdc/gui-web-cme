import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SolicitudCambioContrasenia } from '@models/solicitud-cambio-contrasenia.interface';
import { CambioContrasenia } from '@models/cambio-contrasenia.interface';
import { AspiranteRequest, InteresLaboralRequest } from '@models/aspirante';
import { FotografiaRequest } from '@models/fotografia';
import { ResidenciaRequest } from './residencia';

@Injectable({
    providedIn: 'root'
})
export class ConvocatoriaService {
    private readonly serverEndPointURLConvocatoria = `${environment.api.apiConvocatoria}`;

    http: HttpClient = inject(HttpClient);


    header: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
    });

    getDatosResidencia(idUsuario: number): Observable<any> {
        return this.http.get<any>(`${this.serverEndPointURLConvocatoria} '/aspirante/datos-residencia/ ${idUsuario}`, { headers: this.header }).pipe(
            catchError(this.handleError),
            map((response: any) => {
                return response;
            })
        );
    }

    getDatosDependientes(idUsuario: number): Observable<any> {
        return this.http.get<any>(`${this.serverEndPointURLConvocatoria} '/aspirante/datos-dependientes/ ${idUsuario}`, { headers: this.header }).pipe(
            catchError(this.handleError),
            map((response: any) => {
                return response;
            })
        );
    }

    
    getDatosEmpleo(idUsuario: number): Observable<any> {
        return this.http.get<any>(`${this.serverEndPointURLConvocatoria} '/aspirante/datos-empleo/ ${idUsuario}`, { headers: this.header }).pipe(
            catchError(this.handleError),
            map((response: any) => {
                return response;
            })
        );
    }

    getDatosContacto(idUsuario: number): Observable<any> {
        return this.http.get<any>(`${this.serverEndPointURLConvocatoria} '/aspirante/datos-contacto/ ${idUsuario}`, { headers: this.header }).pipe(
            catchError(this.handleError),
            map((response: any) => {
                return response;
            })
        );
    }

    
    getDatosInteresLaboral(idUsuario: number): Observable<any> {
        return this.http.get<any>(`${this.serverEndPointURLConvocatoria} '/aspirante/datos-interes-laboral/ ${idUsuario}`, { headers: this.header }).pipe(
            catchError(this.handleError),
            map((response: any) => {
                return response;
            })
        );
    }

    getDatosFotografia(idUsuario: number): Observable<any> {
        return this.http.get<any>(`${this.serverEndPointURLConvocatoria} '/aspirante/datos-fotografia/ ${idUsuario}`, { headers: this.header }).pipe(
            catchError(this.handleError),
            map((response: any) => {
                return response;
            })
        );
    }

    
    getDatosDocumentos(idUsuario: number): Observable<any> {
        return this.http.get<any>(`${this.serverEndPointURLConvocatoria} '/aspirante/datos-documentos/ ${idUsuario}`, { headers: this.header }).pipe(
            catchError(this.handleError),
            map((response: any) => {
                return response;
            })
        );
    }

    getVerificacionAspirante(idUsuario: number): Observable<any> {
        return this.http.get<any>(`${this.serverEndPointURLConvocatoria} '/verificacion/aspirante/${idUsuario}`, { headers: this.header }).pipe(
            catchError(this.handleError),
            map((response: any) => {
                return response;
            })
        );
    }

    getEvaluacionDocumentos(idUsuario: number): Observable<any> {
        return this.http.get<any>(`${this.serverEndPointURLConvocatoria} '/verificacion/aspirante/evaluacion-documentos/${idUsuario}`, { headers: this.header }).pipe(
            catchError(this.handleError),
            map((response: any) => {
                return response;
            })
        );
    }

    guardarVerificacionAspirante(aspirante: AspiranteRequest): Observable<any> {
        return this.http.get<any>(`${this.serverEndPointURLConvocatoria} '/verificacion/aspirante'`,aspirante, { headers: this.header }).pipe(
            catchError(this.handleError),
            map((response: any) => {
                return response;
            })
        );
    }

    guardarFoto(foto: FotografiaRequest): Observable<any> {
        return this.http.get<any>(`${this.serverEndPointURLConvocatoria} '/aspirante/datos-fotografia'`,foto, { headers: this.header }).pipe(
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

      guardarContacto(datosContacto: InteresLaboralRequest): Observable<any> {
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

    private handleError(error: HttpErrorResponse) {

        if (error.status) {
            //this._alertService?.error("Error "+error.status +'. Contácte al administrador');
            console.log("Error " + error.status + '. Endpoint: ' + error.url + '. Contácte al administrador');
            // Return an observable with a user-facing error message.
        }
        return throwError(error);
    }
}
