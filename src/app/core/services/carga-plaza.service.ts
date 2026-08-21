import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { HttpRespuesta } from '@models/http-respuesta.interface';
import { RespuestaCargaPlaza } from '@models/respuesta-carga-plaza.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ControlCargaPlazaResponse {
  id?: number;
  idConvocatoria?: number;
  idEstatusCarga?: number;
  desEstatusCarga?: string;
  nomArchivo?: string;
  numTotalRegistros?: number | null;
  numRegistrosValidos?: number | null;
  numRegistrosRechazados?: number | null;
  numPlazasOfertadas?: number | null;
  numPlazasConCredito?: number | null;
  stpInicioCarga?: string | null;
  stpFinCarga?: string | null;
  refMensajeResultado?: string | null;
}

export interface PlazaCargaLayoutResponse {
  idPlaza: number;
  numPlaza: number;
  cveOoad: number | string;
  origenPlaza: string;
}

interface FechaHoraFormateada {
  fecha: string;
  hora: string;
}

@Injectable({
  providedIn: 'root',
})
export class CargaPlazaService {
  private readonly VERSION_API = '/v1/';
  private readonly urlCargaLayoutPlaza = `${environment.api.apiAdmonPlazas}${this.VERSION_API}cargaLayoutPlaza`;
  private readonly http: HttpClient = inject(HttpClient);

  consultarCargaPlazas(idConvocatoria: number): Observable<HttpRespuesta<RespuestaCargaPlaza>> {
    const params = new HttpParams().set('idConvocatoria', idConvocatoria);

    return this.http.get<HttpRespuesta<ControlCargaPlazaResponse | null>>(
      `${this.urlCargaLayoutPlaza}/ultimaCarga`,
      { params }
    ).pipe(
      map((response: HttpRespuesta<ControlCargaPlazaResponse | null>) => ({
        ...response,
        respuesta: this.mapearRespuestaCarga(response.respuesta ?? null),
      }))
    );
  }

  registrarCargaPlazas(idConvocatoria: number, archivo: File): Observable<HttpRespuesta<PlazaCargaLayoutResponse[]>> {
    const formData = new FormData();
    formData.append('idConvocatoria', String(idConvocatoria));
    formData.append('archivo', archivo, archivo.name);

    return this.http.post<HttpRespuesta<PlazaCargaLayoutResponse[]>>(
      `${this.urlCargaLayoutPlaza}/cargarArchivo`,
      formData
    );
  }

  private mapearRespuestaCarga(data: ControlCargaPlazaResponse | null): RespuestaCargaPlaza {
    const inicio = this.obtenerFechaHora(data?.stpInicioCarga);
    const fin = this.obtenerFechaHora(data?.stpFinCarga);

    return {
      fechaInicioFormateada: inicio.fecha,
      horaInicioFormateada: inicio.hora,
      fechaFinFormateada: fin.fecha,
      horaFinFormateada: fin.hora,
      totalPlazasOfertadas: data?.numPlazasOfertadas ?? null,
      totalPlazasCredito: data?.numPlazasConCredito ?? null,
      idEstatusCarga: data?.idEstatusCarga ?? 0,
      procesoEnEjecucion: this.esCargaEnProceso(data),
      tienePlazasAsignadas: false,
      errores: [],
    };
  }

  private esCargaEnProceso(data: ControlCargaPlazaResponse | null): boolean {
    return data?.idEstatusCarga === 1 || data?.desEstatusCarga?.toUpperCase().includes('PROCESO') === true;
  }

  private obtenerFechaHora(fechaHora?: string | null): FechaHoraFormateada {
    if (!fechaHora) {
      return { fecha: '-', hora: '-' };
    }

    const [fecha, hora] = fechaHora.split(' ');

    return {
      fecha: fecha || '-',
      hora: hora || '-',
    };
  }
}
