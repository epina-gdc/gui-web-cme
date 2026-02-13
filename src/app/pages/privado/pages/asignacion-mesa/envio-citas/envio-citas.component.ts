import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ConvocatoriaComponent} from "./components/convocatoria/convocatoria.component";
import {DetalleConvocatoriaComponent} from "./components/detalle-convocatoria/detalle-convocatoria.component";
import {ProcesoAsignacionComponent} from "./components/proceso-asignacion/proceso-asignacion.component";

@Component({
  selector: 'app-envio-citas',
  imports: [ConvocatoriaComponent, DetalleConvocatoriaComponent, ProcesoAsignacionComponent],
  templateUrl: './envio-citas.component.html',
  styleUrl: './envio-citas.component.scss',
  
})
export class EnvioCitasComponent { }
