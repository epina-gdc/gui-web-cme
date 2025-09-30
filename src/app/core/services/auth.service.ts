import {JwtHelperService} from "@auth0/angular-jwt";
import { UserService } from './user.service';
import { SesionUser } from '@models/sesion-user.interface';
import { Payload } from '@models/payload.interface';
import { Router } from '@angular/router';
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
  private readonly URL_ACTUALIZAR_CONTRASENIA: string = 'cambio-contrasena';

  http = inject(HttpClient);
  router = inject(Router);
  usuarioService = inject(UserService);

  login(login: Login): Observable<any> {
    /*const headers = new HttpHeaders({
      'CME-REGISTRO-API-KEY': 'YjRkZjFhYmE5NTAzZTRmNmNiOTdhM2Q2YzVhM2Q0NTNjOGI3MDYxY2YwNDU4M2JkNzdiNDI3NGY2YWE5M2I5',
      'Content-Type': 'application/json'
    });*/
    return this.http.post<any>(`${this.URL_BASE}${this.URL_AUTH}`, login).pipe(
      tap((respuesta: any) => {
        if (respuesta.exito) {
          localStorage.setItem('access_token', respuesta.respuesta.token);
          this.usuarioService.setUser(this.obtenerUsuarioDePayload(respuesta.respuesta.token));
        }
      })
    );
  }

  solicitarCambioPass(solicitud: SolicitudCambioContrasenia): Observable<any> {
    return this.http.post(`${this.URL_BASE}${this.URL_CAMBIO_CONTRASENIA}`, solicitud)
  }

  cambiarPass(solicitud: SolicitudCambioContrasenia): Observable<any> {
    return this.http.post(`${this.URL_BASE}${this.URL_ACTUALIZAR_CONTRASENIA}`, solicitud)
  }

  obtenerUsuarioDePayload(token: string): SesionUser | never{
    let payload: any | null = new JwtHelperService().decodeToken<Payload>(token);
    if (payload) {
      return {
        idPerfil: payload.idPerfil,
        idUsuario: payload.idUsuario,
        nomApellidoPaterno: payload.nomApellidoPaterno,
        nomNombre: payload.nomNombre,
        perfil: payload.perfil,
        refCurp: payload.refCurp,
        refEmail: payload.refEmail,
        sub: payload.sub,
      };
    } else {
      throw new Error('Error al intentar obtener el usuario del payload en el token');
    }
  }

  cerrarSesion(){
    localStorage.clear();
    this.usuarioService.clearUser()
    void this.router.navigate(['/']);
  }
}
