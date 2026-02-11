import { Component, model } from '@angular/core';
import { ConteoComponent } from "./components/conteo/conteo.component";
import { EspecialidadComponent } from "./components/especialidad/especialidad.component";
import { MesasComponent } from "./components/mesas/mesas.component";
import { CardModule } from 'primeng/card';
import { MesaConfiguracion } from '../../services/asignacion-mesa.service';

@Component({
  selector: 'app-detalle-convocatoria',
  imports: [ConteoComponent, EspecialidadComponent, MesasComponent, CardModule],
  templateUrl: './detalle-convocatoria.component.html',
  styleUrl: './detalle-convocatoria.component.scss',
})
export class DetalleConvocatoriaComponent {
  convocatoriaSeleccionada = model<MesaConfiguracion | undefined>(undefined);

}
