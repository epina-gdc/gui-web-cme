import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment.development';
import { Login } from '@models/login';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient);

  login(login: Login): Observable<any> {
    /*const headers = new HttpHeaders({
      'CME-REGISTRO-API-KEY': 'YjRkZjFhYmE5NTAzZTRmNmNiOTdhM2Q2YzVhM2Q0NTNjOGI3MDYxY2YwNDU4M2JkNzdiNDI3NGY2YWE5M2I5',
      'Content-Type': 'application/json'
    });*/
    return this.http.post<any>(`${environment.api.login}auth/authenticate`, login).pipe(
      tap((respuesta: any) => {
        if (respuesta.exito) {
          localStorage.setItem('access_token', respuesta.respuesta.token);
        }
      })
    );
  }
}
