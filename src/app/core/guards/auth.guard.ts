import {inject} from '@angular/core';
import {CanActivateChildFn, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '@services/auth.service';
import {Observable, of} from 'rxjs';
import { CME_TOKEN } from '../../utils/constantes';

export const authGuard: CanActivateChildFn = (childRoute, state) => {
  return checkAuth(state);
};


const checkAuth = (state: RouterStateSnapshot): Observable<boolean> => {
  const auth = inject(AuthService);
  if (localStorage.getItem(CME_TOKEN)){
    return of(true);
    auth.settearSession(localStorage.getItem(CME_TOKEN) as string);
  }
  auth.cerrarSesion();
  return of(false);
};
