import {CanActivateFn, Router, UrlTree} from '@angular/router';
import {Observable, of, switchMap} from 'rxjs';
import {inject} from '@angular/core';
import {AuthService} from '@services/auth.service';

export const medicoGuard: CanActivateFn = (route, state) => {
  return checkMedicalProfile();
};

const checkMedicalProfile = (): Observable<boolean | UrlTree> => {
  const router = inject(Router);
  const authService: AuthService = inject(AuthService);
  const perfilesMedicos = new Set([1, 2, 3, 4, 5, 6]);

  return authService.checkAuthStatus().pipe(
    switchMap(isAuthenticated => {
      if (!isAuthenticated) {
        return of(false);
      }

      const idPerfil = authService.usuarioSesion?.idPerfil as number;

      console.log(idPerfil);

      if (!authService.usuarioSesion) {
        return of(router.createUrlTree(['/login']));
      }

      const menu = authService.usuarioSesion?.menu;
      const url = authService.usuarioSesion?.url;

      console.log(menu, url, perfilesMedicos.has(idPerfil));

      if (url !== '' && !perfilesMedicos.has(idPerfil)) {
        return of(router.createUrlTree([`/privado/${url}`]));
      }

      if ([1, 2, 3, 6].includes(idPerfil)) {
        return of(true);
      } else {
        return of(router.createUrlTree(['/privado/verificacion-documentos']));
      }
    })
  );
};
