import { Component } from '@angular/core';
import { ConfiguracionComponent } from "./components/configuracion/configuracion.component";
import { DetalleMesasComponent } from "./components/detalle-mesas/detalle-mesas.component";


@Component({
  selector: 'app-mesas',
  imports: [
    ConfiguracionComponent,
    DetalleMesasComponent
],
  templateUrl: './mesas.component.html',
  styleUrl: './mesas.component.scss',
})
export class MesasComponent {
  
}
