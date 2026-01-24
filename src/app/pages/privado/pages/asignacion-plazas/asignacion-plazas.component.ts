import { Component } from '@angular/core';
import {PlazaOrdinariaComponent} from '@privado/asignacion-plazas/components/plaza-ordinaria/plaza-ordinaria.component';

@Component({
  selector: 'app-asignacion-plazas',
  imports: [
    PlazaOrdinariaComponent
  ],
  templateUrl: './asignacion-plazas.component.html',
  styleUrl: './asignacion-plazas.component.scss'
})
export class AsignacionPlazasComponent {

}
