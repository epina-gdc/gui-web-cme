import {Routes} from '@angular/router';
import {authGuard} from '@guards/auth.guard';
import {redirectIfAuthenticatedGuard} from '@guards/redirect-if-authenticated.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'publico',
    pathMatch: 'full',
  },
  {
    path: 'publico',
    loadChildren: () => import('./pages/publico/publico.module').then(m => m.PublicoModule),
    canActivate: [redirectIfAuthenticatedGuard]
  },
  {
    path: 'privado',
    loadChildren: () => import('./pages/privado/privado.module').then(m => m.PrivadoModule),
    canActivateChild: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'publico',
    pathMatch: 'full'
  }
];
