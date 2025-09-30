import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment.development';
import { Login } from '@models/login';
import { Observable, tap } from 'rxjs';
import {JwtHelperService} from "@auth0/angular-jwt";
import { UserService } from './user.service';
import { SesionUser } from '@models/sesion-user.interface';
import { Payload } from '@models/payload.interface';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient);
  router = inject(Router);
  usuarioService = inject(UserService);
  
  login(login: Login): Observable<any> {
    return this.http.post<any>(`${environment.api.login}auth/authenticate`, login).pipe(
      tap((respuesta: any) => {
        if (respuesta.exito) {
          localStorage.setItem('access_token', respuesta.respuesta.token);
          this.usuarioService.setUser(this.obtenerUsuarioDePayload(respuesta.respuesta.token));
        }
      })
    );
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
