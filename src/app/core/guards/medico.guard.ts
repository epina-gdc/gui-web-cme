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
      const modulos = authService.usuarioSesion?.modulos;

      if (!PERFILES_COMPLETOS.includes(idPerfil)) {
        return of(router.createUrlTree(['/privado/config-erronea']));
      }

      // perfiles que no pertenecen al modulo 1
      if (!PERFILES_MODULO_1.includes(idPerfil)) {
        if (url !== '') {
          return of(router.createUrlTree([`/privado/${url}`]));
        }

        const destino = modulos?.length === 0 ? 'config-erronea' : 'inicio-modulos';
        return of(router.createUrlTree([`/privado/${destino}`]));
      }

      if ([1, 2, 3, 6, 13].includes(idPerfil)) {
        return of(true);
      }

      return of(router.createUrlTree(['/privado/verificacion-documentos']));    })
  );
};
