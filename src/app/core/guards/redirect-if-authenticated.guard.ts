import { inject } from '@angular/core';
import { CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { Observable, of } from 'rxjs';

export const redirectIfAuthenticatedGuard: CanActivateFn = (route, state) => {
  return checkAuth(state);
};

const checkAuth = (state: RouterStateSnapshot): Observable<boolean> => {
  const router = inject(Router);
  if(localStorage.getItem('access_token')){
    router.navigate(['/privado/inicio']);
    return of(false)
  }else{
    return of(true);
  }
};