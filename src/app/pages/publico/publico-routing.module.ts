import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioSesionComponent } from '@publico/inicio-sesion/inicio-sesion.component';
import { CrearCuentaComponent } from '@publico/crear-cuenta/crear-cuenta.component';
import { NAV } from '@utils/url-global';
import { RegistroMedicoComponent } from './pages/registro-medico/registro-medico.component';

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

    path: NAV.crearCuenta,
    component: CrearCuentaComponent,
  },
  {
    path: NAV.registroMedico,

    component: RegistroMedicoComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicoRoutingModule { }
