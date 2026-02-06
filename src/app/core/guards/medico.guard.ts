import {CanActivateFn, Router, UrlTree} from '@angular/router';
import {Observable, of, switchMap} from 'rxjs';
import {inject} from '@angular/core';
import {AuthService} from '@services/auth.service';
import {PERFILES_COMPLETOS, PERFILES_MODULO_1} from '@utils/constants';

export const medicoGuard: CanActivateFn = (route, state) => {
  return checkMedicalProfile();
};

const checkMedicalProfile = (): Observable<boolean | UrlTree> => {
  const router = inject(Router);
  const authService: AuthService = inject(AuthService);

  return authService.checkAuthStatus().pipe(
    switchMap(isAuthenticated => {
      if (!isAuthenticated) {
        return of(false);
      }

      const idPerfil = authService.usuarioSesion?.idPerfil as number;

      if (!authService.usuarioSesion) {
        return of(router.createUrlTree(['/login']));
      }

      const url = authService.usuarioSesion?.url;

      if (!PERFILES_COMPLETOS.includes(idPerfil)) {
        return of(router.createUrlTree(['/privado/config-erronea']));
      }

      if (!PERFILES_MODULO_1.includes(idPerfil)) {
        if (url !== '') {
          return of(router.createUrlTree([`/privado/${url}`]));
        } else {
          return of(router.createUrlTree(['/privado/config-erronea']));
        }
      }

      if ([1, 2, 3, 6].includes(idPerfil)) {
        return of(true);
      } else {
        return of(router.createUrlTree(['/privado/verificacion-documentos']));
      }
    })
  );
};
