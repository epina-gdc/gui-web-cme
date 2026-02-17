import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { catchError, map, Observable, throwError } from 'rxjs';

// Interfaces existentes (mantenidas para compatibilidad)
export class ResponseGeneral {
  exito!: boolean;
  mensaje!: string;
}

export class TipoConvocatoria {
  idTipoConvocatoria!: number;
  desTipoConvocatoria!: string;
  indActivo!: number;
}

export class Convocatoria {
  idConvocatoria!: number;
  desConvocatoria!: string;
  fecInicio!: string;
  tipo!: TipoConvocatoria;
  fecFin!: string;
  indActivo!: number;
}

export class ResponseConvocatorias extends ResponseGeneral {
  respuesta!: Convocatoria[];
}

export class MesaConvocatoriaRequest {
  idConvocatoria!: number;
  numMesasDisponibles!: number;
  numMedicosPorMesa!: number;
}


// Clase para el objeto Page
export class PageInfo {
  size!: number;
  number!: number;
  totalElements!: number;
  totalPages!: number;
}

// Clase para la configuración de una mesa
export class MesaConfiguracion {
  idConvocatoria!: number;
  idMesaDetalle!: number | null;
  idMesaConvocatoria!: number;
  desConvocatoria!: string;
  numMesasDisponibles!: number;
  numMedicosPorMesa!: number;
  estatus!: string;
  porcentajeConfiguracion!: number;
  fechaInicio!: string;
  fechaFin!: string;

}

// Clase para la estructura de respuesta con paginación
export class ConfiguracionMesasPaginada {
  content!: MesaConfiguracion[];
  page!: PageInfo;
}

// Clase de respuesta para configuración de mesas
export class ResponseConfiguracionMesas extends ResponseGeneral {
  respuesta!: ConfiguracionMesasPaginada;
}


export class ConvocatoriaTotales {
  becados!: {
    totalUsuarios: number,
    totalConvocatorias: number
  };
  residentes!: {
    totalUsuarios: number,
    totalConvocatorias: number
  };
  externos!: {
    totalUsuarios: number,
    totalConvocatorias: number
  };
}

// Clase de respuesta para totales de la convocatoria
export class ResponseConvocatoriaTotales extends ResponseGeneral {
  respuesta!: ConvocatoriaTotales;
}


export class Rama {
  id!: number;
  label!: string;
  cveRama!: string;
}

export class ResponseRamaConvocatoria extends ResponseGeneral {
  respuesta!: Rama[];
}

export class Especialidad {
  descripcionEspecialidad?: string;
  totalUsuarios?: number;
  value?: number;
  label?: string;
  cveEspecialidad?: string;
}
export class TotalesMedicosRama {
  especialidades?: Especialidad[];
  totalMedicos?: number;
}

export class ResponseTotalesMedicosRama extends ResponseGeneral {
  respuesta!: TotalesMedicosRama;
}


export class ResponseEspecialidadRama extends ResponseGeneral {
  respuesta!: Especialidad[];
}

export class MesaDisponibilidad {
  numeroMesa!: number;
  medicosPorMesa!: number;
  lugaresDisponibles!: number;
}


export class ResponseMesasDisponibilidad extends ResponseGeneral {
  respuesta!: MesaDisponibilidad[];
}


export class Turno {
  value!: number;
  label!: string;
}

export class ResponseTurnos extends ResponseGeneral {
  respuesta!: Turno[];
}

export class RequestMesaDetalle {
  idMesaConvocatoria!: number;
  fecAtencion!: string;
  numMesa!: number;
  idEspecialidad!: number;
  idTurno!: number;
  numMedicosCupo!: number;
}

export class EspecialidaDetalle {
  idMesaDetalle!: number;
  numeroMesa!: number;
  especialidad!: string;
  numMedicosCupo!: number;
  tipoMedico!: string;
  idTipoMedico!: number;
}
export class TurnoMesaDetalle {
  turno!: string;
  especialidades!: EspecialidaDetalle[];

}

export class MesaDetalle {
  numeroMesa!: number;
  tituloMesa!: string;
  totalMedicos!: number;
  turnos!: TurnoMesaDetalle[];

}

export class ResponseMesaDetalle extends ResponseGeneral {
  respuesta!: MesaDetalle[];
}

export class ResponseValidaConvocatoria extends ResponseGeneral {
  respuesta!: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class AsignacionMesaService {

  http = inject(HttpClient);

  header: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
  });

  private readonly VERSION_API: string = '/v1/';
  private readonly serverEndPointURLCatalogos = `${environment.api.apiCatalogos + this.VERSION_API + 'catalogos'}`;
  private readonly serverEndPointURLAsignacion = `${environment.api.apiAsignacionMesa + this.VERSION_API + 'mesa'}`;

  // Métodos existentes
  getLstConvocatorias(): Observable<ResponseConvocatorias> {
    return this.http.get<ResponseConvocatorias>(this.serverEndPointURLCatalogos + '/convocatorias', { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: ResponseConvocatorias) => {
        return response;
      })
    );
  }

  /**
   *
   * @param mesaConvocatroria guardar la configuracion de mesa
   * @returns
   */
  guardarMesaConvocatoria(mesaConvocatroria: MesaConvocatoriaRequest): Observable<any> {

    let parametros = new HttpParams();
    parametros = parametros.append('idConvocatoria', mesaConvocatroria.idConvocatoria.toString());
    parametros = parametros.append('numMesasDisponibles', mesaConvocatroria.numMesasDisponibles.toString());
    parametros = parametros.append('numMedicosPorMesa', mesaConvocatroria.numMedicosPorMesa.toString());

    let ruta = `${this.serverEndPointURLAsignacion}/mesa-convocatoria`;
    return this.http.post<any>(ruta, { headers: this.header }, { params: parametros }).pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response;
      })
    );
  }

  /**
  * Obtener lista de configuraciones de mesas con paginación
  * @param page Número de página (0-based)
  * @param size Tamaño de página
  */
  getLstConfiguracionMesas(page: number = 0, size: number = 10): Observable<ResponseConfiguracionMesas> {

    let parametros = new HttpParams();
    parametros = parametros.append('page', page.toString());
    parametros = parametros.append('size', size.toString());

    const params = `?page=${page}&size=${size}`;
    return this.http.get<ResponseConfiguracionMesas>(
      this.serverEndPointURLAsignacion + '/paginado',
      { headers: this.header, params: parametros }

    ).pipe(
      catchError(this.handleError),
      map((response: ResponseConfiguracionMesas) => {
        return response;
      })
    );
  }

  /**
   *
   * @param idConvocatoria
   * @returns
   */

  getConvocatoriaTotales(idConvocatoria: number): Observable<ResponseConvocatoriaTotales> {
    let ruta = `${this.serverEndPointURLAsignacion}/convocatoria/${idConvocatoria}/totales`;
    return this.http.get<ResponseConvocatoriaTotales>(ruta, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: ResponseConvocatoriaTotales) => {
        return response;
      })
    );

  }

  /**
   *
   * @param idConvocatoria
   * @returns
   */
  getRamasConvocatoria(idConvocatoria: number): Observable<ResponseRamaConvocatoria> {
    let parametros = new HttpParams();
    parametros = parametros.append('idConvocatoria', idConvocatoria.toString());

    return this.http.get<ResponseRamaConvocatoria>(this.serverEndPointURLAsignacion + '/ramas', { headers: this.header, params: parametros }).pipe(
      catchError(this.handleError),
      map((response: ResponseRamaConvocatoria) => {
        return response;
      })
    );

  }


  getTotalesMedicosRama(idRama: number, idMesaConvocatoria: number, idConvocatoria: number): Observable<ResponseTotalesMedicosRama> {
    let parametros = new HttpParams();
    parametros = parametros.append('idRama', idRama.toString());
    parametros = parametros.append('idConvocatoria', idConvocatoria.toString());
    parametros = parametros.append('idMesaConvocatoria', idMesaConvocatoria.toString());

    return this.http.get<ResponseTotalesMedicosRama>(this.serverEndPointURLAsignacion + '/totales-medicos-rama', { headers: this.header, params: parametros }).pipe(
      catchError(this.handleError),
      map((response: ResponseTotalesMedicosRama) => {
        return response;
      })
    );
  }


  getEspecialidadesRama(idRama: number, idMesaConvocatoria: number, idConvocatoria: number): Observable<ResponseEspecialidadRama> {
    let parametros = new HttpParams();
    parametros = parametros.append('idRama', idRama.toString());
    parametros = parametros.append('idConvocatoria', idConvocatoria.toString());
    parametros = parametros.append('idMesaConvocatoria', idMesaConvocatoria.toString());

    return this.http.get<ResponseEspecialidadRama>(this.serverEndPointURLAsignacion + '/especialidades-por-rama', { headers: this.header, params: parametros }).pipe(
      catchError(this.handleError),
      map((response: ResponseEspecialidadRama) => {
        return response;
      })
    );

  }

  getMesasDisponibilidad(idMesaConvocatoria: number): Observable<ResponseMesasDisponibilidad> {
    let parametros = new HttpParams();
    parametros = parametros.append('idMesaConvocatoria', idMesaConvocatoria.toString());

    return this.http.get<ResponseMesasDisponibilidad>(this.serverEndPointURLAsignacion + '/disponibilidad', { headers: this.header, params: parametros }).pipe(
      catchError(this.handleError),
      map((response: ResponseMesasDisponibilidad) => {
        return response;
      })
    );
  }

  getTurnos(): Observable<ResponseTurnos> {
    return this.http.get<ResponseTurnos>(this.serverEndPointURLAsignacion + '/turnos', { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: ResponseTurnos) => {
        return response;
      })
    );
  }


  guardarConfiguracionMesa(mesaDetalle: RequestMesaDetalle): Observable<ResponseGeneral> {
    let parametros = new HttpParams();
    parametros = parametros.append('idMesaConvocatoria', mesaDetalle.idMesaConvocatoria.toString());
    parametros = parametros.append('fecAtencion', mesaDetalle.fecAtencion.toString());
    parametros = parametros.append('numMesa', mesaDetalle.numMesa.toString());
    parametros = parametros.append('idEspecialidad', mesaDetalle.idEspecialidad.toString());
    parametros = parametros.append('idTurno', mesaDetalle.idTurno.toString());
    parametros = parametros.append('numMedicosCupo', mesaDetalle.numMedicosCupo.toString());

    let ruta = `${this.serverEndPointURLAsignacion}/mesa-detalle`;
    return this.http.post<ResponseGeneral>(ruta, { headers: this.header }, { params: parametros }).pipe(
      catchError(this.handleError),
      map((response: ResponseGeneral) => {
        return response;
      })
    );
  }


  getDetalleMesaFecha(idMesaConvocatoria: number, fecha: string): Observable<ResponseMesaDetalle> {
    let parametros = new HttpParams();
    parametros = parametros.append('idMesaConvocatoria', idMesaConvocatoria.toString());
    parametros = parametros.append('fecha', fecha.toString());

    return this.http.get<ResponseMesaDetalle>(this.serverEndPointURLAsignacion + '/detalle-mesas', { headers: this.header, params: parametros }).pipe(
      catchError(this.handleError),
      map((response: ResponseMesaDetalle) => {
        return response;
      })
    );

  }

  eliminarEspecialidadMesa(idMesaDetalle: number): Observable<ResponseGeneral> {
    return this.http.put<ResponseGeneral>(this.serverEndPointURLAsignacion + '/mesa-detalle/' + idMesaDetalle.toString() + '/desactivar', { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: ResponseGeneral) => {
        return response;
      })
    );

  }


  getValidaConvocatoria(idConvocatoria: number): Observable<ResponseValidaConvocatoria> {

     let parametros = new HttpParams();
    parametros = parametros.append('idConvocatoria', idConvocatoria.toString());

    return this.http.get<ResponseValidaConvocatoria>(this.serverEndPointURLAsignacion + '/valida-convocatoria', { headers: this.header, params: parametros }).pipe(
      catchError(this.handleError),
      map((response: ResponseValidaConvocatoria) => {
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
