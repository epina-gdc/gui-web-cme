import {Component} from '@angular/core';
import {ConteoComponent} from "./components/conteo/conteo.component";
import {EspecialidadComponent} from "./components/especialidad/especialidad.component";
import {MesasComponent} from "./components/mesas/mesas.component";
import {CardModule} from 'primeng/card';

@Component({
  selector: 'app-detalle-convocatoria',
  imports: [ConteoComponent, EspecialidadComponent, MesasComponent,CardModule],
  templateUrl: './detalle-convocatoria.component.html',
  styleUrl: './detalle-convocatoria.component.scss',
})
export class DetalleConvocatoriaComponent { }
