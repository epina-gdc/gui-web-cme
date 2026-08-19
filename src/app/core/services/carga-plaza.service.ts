import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { HttpRespuesta } from '@models/http-respuesta.interface';
import { RespuestaCargaPlaza } from '@models/respuesta-carga-plaza.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CargaPlazaService {
  private readonly VERSION_API = '/v1/';
  private readonly urlPlazas = `${environment.api.apiAsignacionPlaza}${this.VERSION_API}plaza`;
  private readonly http: HttpClient = inject(HttpClient);

  consultarCargaPlazas(idConvocatoria: number): Observable<HttpRespuesta<RespuestaCargaPlaza>> {
    return this.http.get<HttpRespuesta<RespuestaCargaPlaza>>(`${this.urlPlazas}/consultar-carga/${idConvocatoria}`);
  }

  registrarCargaPlazas(idConvocatoria: number, archivo: File): Observable<HttpRespuesta<RespuestaCargaPlaza>> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('idConvocatoria', String(idConvocatoria));

    return this.http.post<HttpRespuesta<RespuestaCargaPlaza>>(
      `${this.urlPlazas}/cargar-layout/${idConvocatoria}`,
      formData
    );
  }
}