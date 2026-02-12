import {inject, Injectable} from '@angular/core';
import {environment} from '@env/environment.development';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AsistenciaExtraordinariaResponse} from '@models/asistencia-extraordinaria.interface';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  private readonly VERSION_API: string = '/v1/';
  private readonly servicio = 'asistencia/';
  private readonly serverEndPointURLAsistencia = environment.api.apiAsistencia + this.VERSION_API + this.servicio;

  private readonly uriBusqueda: string = 'cita/';

  http: HttpClient = inject(HttpClient);

  header: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  obtenerCita(foliCita: string): Observable<any> {
    return this.http.get<any>(`${this.serverEndPointURLAsistencia}${this.uriBusqueda}${foliCita}`,
      { headers: this.header });
  }
}
