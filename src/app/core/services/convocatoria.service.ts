import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SolicitudCambioContrasenia } from '@models/solicitud-cambio-contrasenia.interface';
import { CambioContrasenia } from '@models/cambio-contrasenia.interface';
import { AspiranteRequest, InteresLaboralRequest } from '@models/aspirante';
import { DataFotografia, FotografiaRequest } from '@models/fotografia';
import { DatosDocumentoResponse } from '@models/datosDocumento';
import { DataContacto, ContactoRequest, DatosContactoResponse } from '@models/datosContacto';

import { DataDomicilio, ResidenciaRequest } from '@models/datosDomicilio';
import { GeneralComponent } from '../../components/general.component';
import { AlertService } from './alert.service';

@Injectable({
    providedIn: 'root'
})
export class ConvocatoriaService {
    private readonly serverEndPointURLConvocatoria = `${environment.api.apiConvocatoria}`;

    http: HttpClient = inject(HttpClient);
    _alertServices: AlertService = inject(AlertService);

    header: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
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

    guardarVerificacionAspirante(aspirante: AspiranteRequest): Observable<any> {
        let ruta = `${this.serverEndPointURLConvocatoria}/verificacion/aspirante'`;
        return this.http.post<any>(ruta, aspirante, { headers: this.header }).pipe(
            catchError(this.handleError),
            map((response: any) => {
                return response;
            })
        );
    }

    guardarFoto(foto: FotografiaRequest): Observable<any> {
        let ruta = `${this.serverEndPointURLConvocatoria}/aspirante/datos-fotografia'`;
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

    private handleError(error: HttpErrorResponse) {

        if (error.status) {
         //   this._alertServices.error("Error "+error.status +'. Contácte al administrador');
            console.log("Error " + error.status + '. Endpoint: ' + error.url + '. Contácte al administrador');
            // Return an observable with a user-facing error message.
          
        }
        return throwError(error);
    }
}
