import {Component} from '@angular/core';
import {
  AsignacionSustitucionComponent
} from '@privado/gestion-convocatorias/components/asignacion-sustitucion/asignacion-sustitucion.component';
import {
  ConfiguracionRegistroComponent
} from '@privado/gestion-convocatorias/components/configuracion-registro/configuracion-registro.component';
import {MenuPlazasComponent} from '@privado/asignacion-plazas/components/menu-plazas/menu-plazas.component';
import {Tab, TabList, Tabs} from 'primeng/tabs';

@Component({
  selector: 'app-gestion-convocatorias',
  imports: [
    AsignacionSustitucionComponent,
    ConfiguracionRegistroComponent,
    Tab,
    TabList,
    Tabs
  ],
  templateUrl: './gestion-convocatorias.component.html',
  styleUrl: './gestion-convocatorias.component.scss'
})
export class GestionConvocatoriasComponent {

  tab: number = 1;

}
