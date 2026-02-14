/**
 * Servicio para monitorear asignaciones en tiempo real
 * Consume: GET /mscme-asignacion/v1/plaza/totalAsignacionesPorTipo
 */
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError, interval } from 'rxjs';
import { catchError, map, switchMap, startWith } from 'rxjs/operators';
import { environment } from '@env/environment';
import { AlertService } from '@services/alert.service';
import { AsignacionesMonitoreoRespuesta, TipoAsignacionMonitoreo } from '@models/tipo-asignacion-monitoreo.interface';

@Injectable({
    providedIn: 'root'
})
export class AsignacionesMonitoreoService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly alertService: AlertService = inject(AlertService);

    // URL del endpoint - usar configuración del environment o URL directa
    private readonly serverEndPoint = 'http://10.166.0.120:1061/mscme-asignacion/v1/plaza/totalAsignacionesPorTipo';

    private readonly version: string = '/v1/';
    private urlAsignacion: string = environment.api.apiAsignacionPlaza + this.version;

    private readonly header: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
    });

    constructor() { }

    /**
     * Obtener total de asignaciones por tipo
     * @returns Observable con array de asignaciones
     */
    obtenerAsignacionesPorTipo(): Observable<TipoAsignacionMonitoreo[]> {
        return this.http.get<AsignacionesMonitoreoRespuesta>(
            //this.urlAsignacion + 'plaza/totalAsignacionesPorTipo',
            this.serverEndPoint,
            { headers: this.header }
        ).pipe(
            map(response => response.respuesta || []),
            catchError(this.handleError.bind(this))
        );
    }

    /**
     * Obtener asignaciones en polling automático (cada 60 segundos)
     * @returns Observable que emite cada 60 segundos
     */
    obtenerAsignacionesEnTiempoReal(): Observable<TipoAsignacionMonitoreo[]> {
        return interval(6000).pipe(
            startWith(0), // Emitir inmediatamente sin esperar 60s
            switchMap(() => this.obtenerAsignacionesPorTipo()),
            catchError(error => {
                console.error('Error en polling de asignaciones:', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Calcular total de asignaciones EXCEPTO "RECHAZO DE OFERTA"
     * @param asignaciones Array de asignaciones
     * @returns Total sumado excluyendo rechazos
     */
    calcularTotalExcluyendoRechazos(asignaciones: TipoAsignacionMonitoreo[]): number {
        return asignaciones
            .filter(a => a.tipoAsignacion !== 'RECHAZO DE OFERTA')
            .reduce((sum, a) => sum + a.total, 0);
    }

    /**
     * Manejo de errores HTTP
     */
    private handleError(error: HttpErrorResponse) {
        let errorMsg = 'Error al consultar asignaciones';
        if (error.error instanceof ErrorEvent) {
            // Error del cliente
            errorMsg = `Error: ${error.error.message}`;
        } else {
            // Error del servidor
            errorMsg = `Error ${error.status}: ${error.message}`;
        }
        console.error(errorMsg);
        return throwError(() => new Error(errorMsg));
    }
}
