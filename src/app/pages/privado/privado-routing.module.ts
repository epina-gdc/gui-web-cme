import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InicioComponent} from '@privado/inicio/inicio.component';
import {PrivadoComponent} from '@pages/privado/privado.component';

const routes: Routes = [{
  path: '',
  component: PrivadoComponent,
  children: [
    {
      path: '',
      redirectTo: 'inicio',
      pathMatch: 'full',
    },
    {
      path: 'inicio',
      component: InicioComponent,
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivadoRoutingModule {
}
