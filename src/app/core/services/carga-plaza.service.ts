import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { HttpRespuesta } from '@models/http-respuesta.interface';
import { RespuestaCargaPlaza, RespuestaRegistroCargaPlaza, ValidacionCargaPlaza } from '@models/respuesta-carga-plaza.interface';
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
  private readonly urlAdministracionPlazas = `${environment.api.apiAdmonPlazas}${this.VERSION_API}administracionPlazas`;
  private readonly http: HttpClient = inject(HttpClient);

  consultarCargaPlazas(idConvocatoria: number): Observable<HttpRespuesta<RespuestaCargaPlaza>> {
    const params = new HttpParams().set('idConvocatoria', String(idConvocatoria));

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

  validarPlazasOcupadas(idConvocatoria: number): Observable<HttpRespuesta<ValidacionCargaPlaza>> {
    const params = new HttpParams().set('idConvocatoria', String(idConvocatoria));

    return this.http.get<HttpRespuesta<ValidacionCargaPlaza>>(
      `${this.urlAdministracionPlazas}/plazaValidacion`,
      { params }
    );
  }

  registrarCargaPlazas(idConvocatoria: number, archivo: File): Observable<HttpRespuesta<RespuestaRegistroCargaPlaza>> {
    const formData = new FormData();
    formData.append('idConvocatoria', String(idConvocatoria));
    formData.append('archivo', archivo, archivo.name);

    return this.http.post<HttpRespuesta<RespuestaRegistroCargaPlaza>>(
      `${this.urlCargaLayoutPlaza}/cargarArchivo`,
      formData
    );
  }

  private mapearRespuestaCarga(data: ControlCargaPlazaResponse | null): RespuestaCargaPlaza {
    const inicio = this.obtenerFechaHora(data?.stpInicioCarga);
    const fin = this.obtenerFechaHora(data?.stpFinCarga);

    return {
      nombreArchivo: data?.nomArchivo ?? null,
      fechaInicioFormateada: inicio.fecha,
      horaInicioFormateada: inicio.hora,
      fechaFinFormateada: fin.fecha,
      horaFinFormateada: fin.hora,
      totalRegistros: data?.numTotalRegistros ?? null,
      totalRegistrosValidos: data?.numRegistrosValidos ?? null,
      totalRegistrosRechazados: data?.numRegistrosRechazados ?? null,
      totalPlazasOfertadas: data?.numPlazasOfertadas ?? null,
      totalPlazasCredito: data?.numPlazasConCredito ?? null,
      idEstatusCarga: data?.idEstatusCarga ?? 0,
      procesoEnEjecucion: this.esCargaEnProceso(data),
      mensajeResultado: data?.refMensajeResultado ?? null,
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
