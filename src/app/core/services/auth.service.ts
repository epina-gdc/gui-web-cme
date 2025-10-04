import {JwtHelperService} from "@auth0/angular-jwt";
import {UserService} from './user.service';
import {SesionUser} from '@models/sesion-user.interface';
import {Payload} from '@models/payload.interface';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {environment} from '@env/environment.development';
import {Login} from '@models/login';
import {BehaviorSubject, map, Observable, tap} from 'rxjs';
import {SolicitudCambioContrasenia} from '@models/solicitud-cambio-contrasenia.interface';
import {CambioContrasenia} from '@models/cambio-contrasenia.interface';
import {CME_TOKEN} from "../../utils/constantes";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly URL_BASE: string = environment.api.login + 'auth/';
  private readonly URL_AUTH: string = 'authenticate';
  private readonly URL_CAMBIO_CONTRASENIA: string = 'solicitud-cambio-contrasena';
  private readonly URL_ACTUALIZAR_CONTRASENIA: string = 'cambio-contrasena';

  private readonly usuarioSesionSubject = new BehaviorSubject<SesionUser | null>(null);

  http = inject(HttpClient);
  router = inject(Router);
  usuarioService = inject(UserService);

  get usuarioSesion() {
    return this.usuarioSesionSubject.value;
  }

  existeUnaSesion$: Observable<boolean> = this.usuarioService.userData$
    .pipe(map((usuario: SesionUser | null) => !!usuario));


  constructor() {
    this.recuperarSesionAlRecargarPagina()
  }

  login(login: Login): Observable<any> {
    return this.http.post<any>(`${this.URL_BASE}${this.URL_AUTH}`, login).pipe(
      tap((respuesta: any) => {
        if (respuesta.exito) {
          localStorage.setItem(CME_TOKEN, respuesta.respuesta.token);
          this.settearSession(respuesta.respuesta.token);
        }
      })
    );
  }

  recuperarSesionAlRecargarPagina() {
    const token: string | null = localStorage.getItem(CME_TOKEN);
    if (token) {
      this.settearSession(token);
    } else {
      this.cerrarSesion();
    }
  }

  settearSession(token: string) {
    this.agregarUsuarioSesion(token);
    this.usuarioService.setUser(this.obtenerUsuarioDePayload(token));
  }

  private agregarUsuarioSesion(accessToken: string): void {
    const usuarioSesion: SesionUser = this.obtenerUsuarioDePayload(accessToken);
    this.usuarioSesionSubject.next(usuarioSesion);
  }

  obtenerUsuarioDePayload(token: string): SesionUser | never {
    let payload: any | null = new JwtHelperService().decodeToken<Payload>(token);
    if (payload) {
      return {
        idPerfil: payload.idPerfil,
        idUsuario: payload.idUsuario,
        nomApellidoPaterno: payload.nomApellidoPaterno,
        nomNombre: payload.nomNombre,
        nomApellidoMaterno: payload.nomApellidoMaterno,
        cveMatricula: payload.cveMatricula,
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
    this.usuarioSesionSubject.next(null)
    void this.router.navigate(['/']);
  }
}
