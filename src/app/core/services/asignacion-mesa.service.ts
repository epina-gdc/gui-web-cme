import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';

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
  private readonly serverEndPointURLCatalogos1 = `${environment.api.apiConvocatoria + '/catalogos'}`;
  private readonly serverEndPointURLVerificacionDocs = `${environment.api.apiConvocatoria + '/verificacion/catalogos'}`;


}
