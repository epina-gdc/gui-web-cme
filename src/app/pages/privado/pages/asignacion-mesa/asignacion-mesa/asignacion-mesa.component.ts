import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { BuscarConvocatoriaComponent } from "../components/buscar-convocatoria/buscar-convocatoria.component";
import { DetalleConvocatoriaComponent } from "../components/detalle-convocatoria/detalle-convocatoria.component";

@Component({
  selector: 'app-asignacion-mesa',
  imports: [CommonModule, TabsModule, BuscarConvocatoriaComponent, DetalleConvocatoriaComponent],
  templateUrl: './asignacion-mesa.component.html',
  styleUrl: './asignacion-mesa.component.scss',
})
export class AsignacionMesaComponent {
   tab: number = 0;
 }
