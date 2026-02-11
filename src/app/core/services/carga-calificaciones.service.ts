import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '@env/environment.development';

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
}
