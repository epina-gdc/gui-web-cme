import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { catchError, map, Observable, throwError } from 'rxjs';


export class ResponseGeneral {
  exito!: boolean;
  mensaje!: string;
}

export class FechasHorasEnvios {
  fechaInicio!: String;
  fechaFin!: String;
  horaInicio!: String;
  horaFin!: String;
}
export class TotalCitas {
  totalBecados!: number;
  totalResidentes!: number;
  totalExternos!: number;
  totalMedicos!: number;
  totalesEnviados!: number;
  totalesNoEnviados!: number;
  porcentajeEnviados!: number;
  fechasHorasEnvios?: FechasHorasEnvios | null;
  validaBecados!: true;
  validaResidentes!: true;
  validaMedicosExterno!: true;
}

export class ResponseTotalesCistas extends ResponseGeneral {
  respuesta!: TotalCitas;
}


export class RequestAsignacionCitas {
  idConvocatoria!: number;
  idTipoMedico!: number;
}

export class ResponseAsignacionCitas extends ResponseGeneral {
  respuesta!: string;
}


export enum TypeMedico {
  BECADOS = 1,
  RESIDENTES = 2,
  EXTERNOS = 3,
}


@Injectable({
  providedIn: 'root'
})
export class EnvioCitasService {

  http = inject(HttpClient);

  header: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
  });

  private readonly VERSION_API: string = '/v1/';
  private readonly serverEndPointURLAsignacion = `${environment.api.apiAsignacionMesa + this.VERSION_API + 'api'}`;


  consultaTotalesCitas(idConvocatoria: number, idTipoMedico: number): Observable<ResponseTotalesCistas> {
    let parametros = new HttpParams();
    parametros = parametros.append('idConvocatoria', idConvocatoria.toString());
    parametros = parametros.append('idTipoMedico', idTipoMedico.toString());

    return this.http.get<ResponseTotalesCistas>(this.serverEndPointURLAsignacion + '/consultar-totales-citas', { headers: this.header, params: parametros }).pipe(
      catchError(this.handleError),
      map((response: ResponseTotalesCistas) => {
        return response;
      })
    );
  }

  guardarAsignacionCitas(idConvocatoria: number, idTipoMedico: number): Observable<ResponseGeneral> {
    return this.http.post<ResponseGeneral>(this.serverEndPointURLAsignacion + '/registar-asignacion-citas', { idConvocatoria: idConvocatoria, idTipoMedico: idTipoMedico }, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: ResponseGeneral) => {
        return response;
      })
    );
  }

  // Método auxiliar para manejar errores
  private handleError(error: HttpErrorResponse) {
    console.error("Error HTTP " + error.status + ':', error.message);
    return throwError(() => error);
  }

}