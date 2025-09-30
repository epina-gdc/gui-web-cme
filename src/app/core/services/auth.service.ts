import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {environment} from '@env/environment.development';
import {Login} from '@models/login';
import {Observable, tap} from 'rxjs';
import {SolicitudCambioContrasenia} from '@models/solicitud-cambio-contrasenia.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly URL_BASE: string = environment.api.login + 'auth/';
  private readonly URL_AUTH: string = 'authenticate';
  private readonly URL_CAMBIO_CONTRASENIA: string = 'solicitud-cambio-contrasena';

  http = inject(HttpClient);

  login(login: Login): Observable<any> {
    /*const headers = new HttpHeaders({
      'CME-REGISTRO-API-KEY': 'YjRkZjFhYmE5NTAzZTRmNmNiOTdhM2Q2YzVhM2Q0NTNjOGI3MDYxY2YwNDU4M2JkNzdiNDI3NGY2YWE5M2I5',
      'Content-Type': 'application/json'
    });*/
    return this.http.post<any>(`${this.URL_BASE}${this.URL_AUTH}`, login).pipe(
      tap((respuesta: any) => {
        if (respuesta.exito) {
          localStorage.setItem('access_token', respuesta.respuesta.token);
        }
      })
    );
  }

  solicitarCambioPass(solicitud: SolicitudCambioContrasenia): Observable<any> {
    return this.http.post(`${this.URL_BASE}${this.URL_CAMBIO_CONTRASENIA}`, solicitud)
  }
}
