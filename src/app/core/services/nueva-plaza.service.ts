import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { HttpRespuesta } from '@models/http-respuesta.interface';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface OoadPlaza {
  cveOoad: string;
  desOoad: string;
}

export interface EspecialidadPlaza {
  cveEspecialidad: string;
  desEspecialidad: string;
}

export interface ClasificacionUnidadPlaza {
  cveClasificacionUnidad: string;
  descClasificacionUnidad: string;
}

export interface UnidadNuevaPlaza {
  cveUnidad: string;
  descUnidad: string;
}

export interface AdscripcionPlaza {
  cveAdscripcion?: string;
  cveUnidad?: string;
  descAdscripcion?: string;
  desAdscripcion?: string;
}

export interface PuestoPlaza {
  cvePuesto: string;
  descPuesto: string;
}

export interface CategoriaPlaza {
  cveCategoria: string;
  descCategoria: string;
}

export interface TurnoNuevaPlaza {
  cveTurno: number;
  descTurno: string;
}

export interface HorarioNuevaPlaza {
  cveHorario: string;
  descHorario: string;
}

export interface TipoPlaza {
  cveTipoPlaza: string;
  descTipoPlaza: string;
}

export interface MarcaOcupacionNuevaPlaza {
  cveMarcaOcupacion: number;
  descMarcaOcupacion: string;
}

export interface TipoUnidadPlaza {
  cveTipoUnidad: string;
  descTipoUnidad: string;
}

export interface StatusPlaza {
  idEstatusPlaza: number;
  descEstatusPlaza: string;
}

export interface NuevaPlazaCatalogos {
  ooads: HttpRespuesta<OoadPlaza[]>;
  especialidades: EspecialidadPlaza[];
  clasificacionesUnidad: HttpRespuesta<ClasificacionUnidadPlaza[]>;
  unidades: HttpRespuesta<UnidadNuevaPlaza[]>;
  adscripciones: HttpRespuesta<AdscripcionPlaza[]>;
  puestos: HttpRespuesta<PuestoPlaza[]>;
  categorias: HttpRespuesta<CategoriaPlaza[]>;
  turnos: HttpRespuesta<TurnoNuevaPlaza[]>;
  horarios: HttpRespuesta<HorarioNuevaPlaza[]>;
  tiposPlaza: HttpRespuesta<TipoPlaza[]>;
  marcasOcupacion: HttpRespuesta<MarcaOcupacionNuevaPlaza[]>;
  tiposUnidad: HttpRespuesta<TipoUnidadPlaza[]>;
  statusPlaza: HttpRespuesta<StatusPlaza[]>;
}

export interface RegistrarPlazaRequest {
  numPlaza?: number;
  cveOoad: string | number;
  descOoad?: string;
  cveZona?: string | number;
  descZona?: string;
  clasificacion?: string;
  cveUnidad?: string;
  descUnidad?: string;
  cveDepartamento?: string;
  descDepartamento?: string;
  cvePuesto?: string;
  descPuesto?: string;
  cveCategoria?: string;
  descCategoria?: string;
  cveAreaResponsabilidad?: string;
  descAreaResponsabilidad?: string;
  cveTurno?: number;
  descTurno?: string;
  cveHorario?: string;
  descHorario?: string;
  cveTipoPlaza?: string;
  descTipoPlaza?: string;
  cveMarcaOcupacion?: number;
  descMarcaOcupacion?: string;
  descRegimen?: string | number;
  refDireccionUnidad?: string;
  indHospitalNuevo?: number;
  refSueldoMensualBruto?: number;
  refSueldoMensualNeto?: number;
  indAccesoCredito?: number;
  refCredHipotecarioImporte?: number;
  refCredAutomotrizImporte?: number;
  refCredHipotecarioQuincenal?: number;
  refCredAutomotrizQuincenal?: number;
  refBonoDificilCobertura?: number;
  refAltoCostoVida?: number;
  idEstatusPlaza: number;
  origenPlaza?: string;
  desObservaciones?: string;
}

export interface ActualizarPlazaRequest extends RegistrarPlazaRequest {
  idPlaza: number;
  numPlaza: number;
}

export interface DetallePlazaResponse {
  idPlaza: number;
  cveOoad?: string | number;
  cvePuesto?: string;
  cveUnidad?: string;
  cveZona?: string | number;
  cveCategoria?: string;
  cveAreaResponsabilidad?: string;
  cveEspecialidad?: string;
  cveTurno?: string | number;
  cveHorario?: string;
  cveTipoPlaza?: string;
  cveMarcaOcupacion?: string | number;
  cveDepartamento?: string;
  cveAdscripcion?: string;
  cveClasificacionUnidad?: string;
  numPlaza?: string | number;
  idEstatusPlaza?: number;
  origenPlaza?: string;
  [key: string]: unknown;
}

export interface RegistrarPlazaRespuesta {
  idPlaza: number;
  cveOoad?: string;
  cvePuesto?: string;
  cveUnidad?: string;
  especialidad?: string;
  categoria?: string;
  regimen?: string;
  turno?: string;
  tipoPlaza?: string;
  marcaOcupacion?: string;
  numPlaza?: string;
  idEstatusPlaza?: number;
  estatusPlaza?: string;
  idConvocatoria?: number;
  origenPlaza?: string;
  observaciones?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NuevaPlazaService {
  private readonly VERSION_API = '/v1/';
  private readonly serverEndPointURLCatalogosPlazas = `${environment.api.apiCatalogos}${this.VERSION_API}catalogos/plazas`;
  private readonly serverEndPointURLCatalogos = `${environment.api.apiCatalogos}${this.VERSION_API}catalogos`;
  private readonly serverEndPointURLAdministracionPlazas = `${environment.api.apiAdmonPlazas}${this.VERSION_API}administracionPlazas`;
  private readonly http: HttpClient = inject(HttpClient);

  header: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
  });

  getOoads(): Observable<HttpRespuesta<OoadPlaza[]>> {
    return this.getCatalogo<OoadPlaza>('ooads');
  }

  getEspecialidades(): Observable<EspecialidadPlaza[]> {
    return this.getArrCatalogo<EspecialidadPlaza>('especialidades');
  }

  getClasificacionesUnidad(): Observable<HttpRespuesta<ClasificacionUnidadPlaza[]>> {
    return this.getCatalogoPlazas<ClasificacionUnidadPlaza>('clasificaciones-unidad');
  }

  getUnidades(): Observable<HttpRespuesta<UnidadNuevaPlaza[]>> {
    return this.getCatalogoPlazas<UnidadNuevaPlaza>('unidades');
  }

  getAdscripciones(): Observable<HttpRespuesta<AdscripcionPlaza[]>> {
    return this.getCatalogoPlazas<AdscripcionPlaza>('adscripciones');
  }

  getPuestos(): Observable<HttpRespuesta<PuestoPlaza[]>> {
    return this.getCatalogoPlazas<PuestoPlaza>('puestos');
  }

  getCategorias(): Observable<HttpRespuesta<CategoriaPlaza[]>> {
    return this.getCatalogoPlazas<CategoriaPlaza>('categorias');
  }

  getTurnos(): Observable<HttpRespuesta<TurnoNuevaPlaza[]>> {
    return this.getCatalogoPlazas<TurnoNuevaPlaza>('turnos');
  }

  getHorarios(): Observable<HttpRespuesta<HorarioNuevaPlaza[]>> {
    return this.getCatalogoPlazas<HorarioNuevaPlaza>('horarios');
  }

  getTiposPlaza(): Observable<HttpRespuesta<TipoPlaza[]>> {
    return this.getCatalogoPlazas<TipoPlaza>('tipos-plaza');
  }

  getMarcasOcupacion(): Observable<HttpRespuesta<MarcaOcupacionNuevaPlaza[]>> {
    return this.getCatalogoPlazas<MarcaOcupacionNuevaPlaza>('marcas-ocupacion');
  }

  getTiposUnidad(): Observable<HttpRespuesta<TipoUnidadPlaza[]>> {
    return this.getCatalogoPlazas<TipoUnidadPlaza>('tipos-unidad');
  }

  getStatusPlaza(): Observable<HttpRespuesta<StatusPlaza[]>> {
    return this.getCatalogoPlazas<StatusPlaza>('estatus-plaza');
  }

  buscarDetallePlaza(idPlaza: number): Observable<HttpRespuesta<DetallePlazaResponse>> {
    return this.http.get<HttpRespuesta<DetallePlazaResponse>>(
      `${this.serverEndPointURLAdministracionPlazas}/buscarDetallePlaza/${idPlaza}`,
      { headers: this.header }
    ).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<DetallePlazaResponse>) => response)
    );
  }

  registrarPlaza(request: RegistrarPlazaRequest): Observable<HttpRespuesta<RegistrarPlazaRespuesta>> {
    return this.postNuevaPlaza<RegistrarPlazaRespuesta>('registrarPlaza', request);
  }

  actualizarPlaza(request: ActualizarPlazaRequest): Observable<HttpRespuesta<RegistrarPlazaRespuesta>> {
    return this.putNuevaPlaza<RegistrarPlazaRespuesta>('actualizarPlaza', request);
  }

  private postNuevaPlaza<T>(recurso: string, request: RegistrarPlazaRequest): Observable<HttpRespuesta<T>> {
    return this.http.post<HttpRespuesta<T>>(
      `${this.serverEndPointURLAdministracionPlazas}/${recurso}`,
      request,
      { headers: this.header }
    ).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<T>) => response)
    );
  }

  private putNuevaPlaza<T>(recurso: string, request: ActualizarPlazaRequest): Observable<HttpRespuesta<T>> {
    return this.http.put<HttpRespuesta<T>>(
      `${this.serverEndPointURLAdministracionPlazas}/${recurso}`,
      request,
      { headers: this.header }
    ).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<T>) => response)
    );
  }

  private getCatalogo<T>(recurso: string): Observable<HttpRespuesta<T[]>> {
    return this.http.get<HttpRespuesta<T[]>>(`${this.serverEndPointURLCatalogos}/${recurso}`, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<T[]>) => response)
    );
  }

  private getCatalogoPlazas<T>(recurso: string): Observable<HttpRespuesta<T[]>> {
    return this.http.get<HttpRespuesta<T[]>>(`${this.serverEndPointURLCatalogosPlazas}/${recurso}`, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: HttpRespuesta<T[]>) => response)
    );
  }

  private getArrCatalogo<T>(recurso: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.serverEndPointURLCatalogos}/${recurso}`, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: T[]) => response)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status) {
      console.log('Error ' + error.status + '. Endpoint: ' + error.url + '. Contacte al administrador');
    }

    return throwError(() => error);
  }
}
