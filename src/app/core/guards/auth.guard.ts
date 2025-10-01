import {inject} from '@angular/core';
import {CanActivateChildFn, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '@services/auth.service';
import {Observable, of} from 'rxjs';

export const authGuard: CanActivateChildFn = (childRoute, state) => {
  return checkAuth(state);
};


const checkAuth = (state: RouterStateSnapshot): Observable<boolean> => {
  const auth = inject(AuthService);
  if (localStorage.getItem('access_token')){
    return of(true);
    auth.settearSession(localStorage.getItem('access_token') as string);
  }
  auth.cerrarSesion();
  return of(false);
};
