import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InicioSesionComponent} from '@publico/inicio-sesion/inicio-sesion.component';
import {CrearCuentaComponent} from '@publico/crear-cuenta/crear-cuenta.component';
import {ResidenteComponent} from '@publico/residente/residente.component';
import {ExternoComponent} from '@publico/externo/externo.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio-sesion',
    pathMatch: 'full',
  },
  {
    path: 'inicio-sesion',
    component: InicioSesionComponent,
  },
  {
    path: 'crear-cuenta',
    component: CrearCuentaComponent,
  },

  {
    path: 'medico-externo',
    component: ExternoComponent,
  },

  {
    path: 'medico-residente',
    component: ResidenteComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicoRoutingModule { }
