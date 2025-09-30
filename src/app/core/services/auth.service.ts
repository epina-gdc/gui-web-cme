import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment.development';
import { Login } from '@models/login';
import { Observable, tap } from 'rxjs';
import {JwtHelperService} from "@auth0/angular-jwt";
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient);
  usuarioService$ = inject(UserService);
  
  login(login: Login): Observable<any> {
    return this.http.post<any>(`${environment.api.login}auth/authenticate`, login).pipe(
      tap((respuesta: any) => {
        if (respuesta.exito) {
          localStorage.setItem('access_token', respuesta.respuesta.token);
          let payload: any | null = new JwtHelperService().decodeToken<any>(respuesta.respuesta.token);
          this.usuarioService$.setUser(payload);
        }
      })
    );
  }
}
