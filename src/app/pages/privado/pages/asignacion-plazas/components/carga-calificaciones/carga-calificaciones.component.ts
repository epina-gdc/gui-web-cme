import {Component, signal, WritableSignal} from '@angular/core';
import {MenuPlazasComponent} from '@privado/asignacion-plazas/components/menu-plazas/menu-plazas.component';
import {Button} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';



@Component({
  selector: 'app-carga-calificaciones',
  imports: [
    MenuPlazasComponent,
    Button,
    DialogModule
  ],
  templateUrl: './carga-calificaciones.component.html',
  styleUrl: './carga-calificaciones.component.scss',
})
export class CargaCalificacionesComponent {

  confCargaCalificaciones: boolean = false;

  constructor() {

  }


  listaProcesoAutomatico: string[] = [
    "Se consulta el servicio API proporcionado por el área médica",
    "Si ya existe información, se actualiza automáticamente",
    "No se requiere intervención adicional del usuario",
    "Si existe una interrupción en el proceso de carga, intentar nuevamente.\n Si el error persiste comunícate con el administrador del sistema."
  ];

  porcentaje: WritableSignal<number> = signal(666);


  abrirModalConfirmarCargaCalificaciones(): void {


  }


}
