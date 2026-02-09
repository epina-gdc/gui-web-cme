import {CommonModule} from '@angular/common';
import {Component, signal} from '@angular/core';
import {TabsModule} from 'primeng/tabs';
import {DetalleConvocatoriaComponent} from './components/detalle-convocatoria/detalle-convocatoria.component';
import {BuscarConvocatoriaComponent} from './components/buscar-convocatoria/buscar-convocatoria.component';
import {EnvioCitasComponent} from "../envio-citas/envio-citas.component";

@Component({
  selector: 'app-asignacion-mesa',
  imports: [CommonModule, TabsModule, BuscarConvocatoriaComponent, DetalleConvocatoriaComponent, EnvioCitasComponent],
  templateUrl: './asignacion-mesa.component.html',
  styleUrl: './asignacion-mesa.component.scss',
})
export class AsignacionMesaComponent {
  tab: number = 0;
  convocatoriaActual = signal<any | null>(null);
}
