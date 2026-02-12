import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { extend } from 'dayjs';
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
  cvRama!: string;
}

export class ResponseRamaConvocatoria extends ResponseGeneral {
  respuesta!: Rama[];
}

export class Especialida {
  descripcionEspecialidad?: string;
  totalUsuarios?: number;
  value?: number;
  label?: string;
}
export class TotalesMedicosRama {
  especialidades?: Especialida[];
  totalMedicos?: number;
}

export class ResponseTotalesMedicosRama extends ResponseGeneral {
  respuesta!: TotalesMedicosRama;
}


export class ResponseEspecialidadRama extends ResponseGeneral {
  respuesta!: Especialida[];
}

export class MesaDisponibilidad {
  numeroMesa!: number;
  medicosPorMesa!:number;
  lugaresDisponibles!: number;
}


export class ResponseMesasDisponibilidad extends ResponseGeneral {
  respuesta!: MesaDisponibilidad[];
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

  getMesasDisponibilidad(idMesaConvocatoria : number): Observable<any> {

  }


  // Método auxiliar para manejar errores
  private handleError(error: HttpErrorResponse) {
    console.error("Error HTTP " + error.status + ':', error.message);
    return throwError(() => error);
  }



}