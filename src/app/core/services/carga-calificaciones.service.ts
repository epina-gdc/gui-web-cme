import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '@env/environment.development';
import {HttpRespuesta} from '@models/http-respuesta.interface';
import {CargaSustitutosResponse} from '@models/carga-sustitutos.interface';

@Injectable({
  providedIn: 'root'
})
export class CargaCalificacionesService {
  private URLConvcatoria: string = environment.api.apiCalificaciones;

  http: HttpClient = inject(HttpClient);

  consultaCargaCalificaciones(id: number): Observable<any> {
    return this.http.get(`${this.URLConvcatoria}/consultar-carga/${id}`);
  }

  registrarCargaCalificaciones(id: number): Observable<any> {
    return this.http.get(`${this.URLConvcatoria}/registrar-carga/${id}`);
  }

  obtenerValidacionCalificaciones(id: number): Observable<any> {
    return this.http.get(`${this.URLConvcatoria}/consultar-mesas-activas/${id}`);
  }

  cargarSustitutos(idConvocatoria: number): Observable<HttpRespuesta<CargaSustitutosResponse>> {
    return this.http.post<HttpRespuesta<CargaSustitutosResponse>>(
      `${this.URLConvcatoria}/cargar-sustitutos/${idConvocatoria}`,
      {}
    );
  }

  consultarCargaSustitutos(idConvocatoria: number): Observable<HttpRespuesta<CargaSustitutosResponse | null>> {
    return this.http.get<HttpRespuesta<CargaSustitutosResponse | null>>(
      `${this.URLConvcatoria}/consulta-carga-sustitutos/${idConvocatoria}`
    );
  }
}
