import {JwtHelperService} from "@auth0/angular-jwt";
import {UserService} from './user.service';
import {SesionUser} from '@models/sesion-user.interface';
import {Payload} from '@models/payload.interface';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {environment} from '@env/environment.development';
import {Login} from '@models/login';
import {map, Observable, tap} from 'rxjs';
import {SolicitudCambioContrasenia} from '@models/solicitud-cambio-contrasenia.interface';
import {CambioContrasenia} from '@models/cambio-contrasenia.interface';

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

  existeUnaSesion$: Observable<boolean> = this.usuarioService.userData$
    .pipe(
      map((usuario: SesionUser | null) => !!usuario)
    )


  login(login: Login): Observable<any> {
    return this.http.post<any>(`${this.URL_BASE}${this.URL_AUTH}`, login).pipe(
      tap((respuesta: any) => {
        if (respuesta.exito) {
          localStorage.setItem('access_token', respuesta.respuesta.token);
          this.settearSession(respuesta.respuesta.token);
        }
      })
    );
  }

  settearSession(token: string){
    this.usuarioService.setUser(this.obtenerUsuarioDePayload(token));
  }

  solicitarCambioPass(solicitud: SolicitudCambioContrasenia): Observable<any> {
    return this.http.post(`${this.URL_BASE}${this.URL_CAMBIO_CONTRASENIA}`, solicitud)
  }

  cambiarPass(solicitud: CambioContrasenia, token: string): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();

    headers = headers.set('Authorization', `Bearer ${token}`);
    headers = headers.set('Content-Type', 'application/json');

    const httpOptions = {headers: headers};

    return this.http.post(`${this.URL_BASE}${this.URL_ACTUALIZAR_CONTRASENIA}`, solicitud, httpOptions)
  }

  obtenerUsuarioDePayload(token: string): SesionUser | never {
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

  cerrarSesion() {
    localStorage.clear();
    this.usuarioService.clearUser()
    void this.router.navigate(['/']);
  }
}
