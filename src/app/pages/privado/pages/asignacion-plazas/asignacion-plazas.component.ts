import {Component} from '@angular/core';
import {PlazaOrdinariaComponent} from '@privado/asignacion-plazas/components/plaza-ordinaria/plaza-ordinaria.component';
import {CoplamarComponent} from '@privado/asignacion-plazas/components/coplamar/coplamar.component';
import {
  AsignacionSustitucionComponent
} from '@privado/asignacion-plazas/components/asignacion-sustitucion/asignacion-sustitucion.component';
import {TabsModule} from 'primeng/tabs';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-asignacion-plazas',
  imports: [
    TabsModule,
    PlazaOrdinariaComponent,
    CoplamarComponent,
    AsignacionSustitucionComponent,
    CommonModule,
  ],
  templateUrl: './asignacion-plazas.component.html',
  styleUrl: './asignacion-plazas.component.scss'
})
export class AsignacionPlazasComponent {

  tab: number = 0;

}
