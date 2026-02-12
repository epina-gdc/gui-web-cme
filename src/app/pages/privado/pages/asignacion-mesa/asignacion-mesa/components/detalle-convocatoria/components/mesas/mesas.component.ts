import { Component, model } from '@angular/core';
import { ConfiguracionComponent } from "./components/configuracion/configuracion.component";
import { DetalleMesasComponent } from "./components/detalle-mesas/detalle-mesas.component";
import { MesaConfiguracion, Rama } from '../../../../services/asignacion-mesa.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-mesas',
  imports: [
    CommonModule,
    ConfiguracionComponent,
    DetalleMesasComponent
  ],
  templateUrl: './mesas.component.html',
  styleUrl: './mesas.component.scss',
})
export class MesasComponent {
  convocatoriaSeleccionada = model<MesaConfiguracion | undefined>(undefined);
  ramaActual = model<Rama | undefined>(undefined);

  accionActualiza = model<boolean | undefined>(undefined);

}
