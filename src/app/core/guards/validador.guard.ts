import {CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {inject} from '@angular/core';
import {AuthService} from '@services/auth.service';

export const validadorGuard: CanActivateFn = (route, state) => {
  return checkValidadorProfile(state);
};

const checkValidadorProfile = (state: RouterStateSnapshot): Observable<boolean> => {
  const router = inject(Router);
  const authService: AuthService = inject(AuthService);
  const idPerfil = authService.usuarioSesion?.idPerfil as number;
  if ([4,5].includes(idPerfil)) {
    return of(true)
  }
  void router.navigate(['/privado/inicio']);
  return of(false);
};
