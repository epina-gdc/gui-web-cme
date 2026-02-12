import {Component, OnDestroy, signal, WritableSignal} from '@angular/core';
import {CardModule} from 'primeng/card';
import {Button} from 'primeng/button';
import {BehaviorSubject, Subscription, timer} from 'rxjs';

@Component({
  selector: 'app-visualizacion-asistencia',
  imports: [CardModule, Button],
  templateUrl: './visualizacion-asistencia.component.html',
  styleUrl: './visualizacion-asistencia.component.scss'
})
export class VisualizacionAsistenciaComponent implements OnDestroy {

  datosMedico = signal<any | null>(null);
  private timerSubscription?: Subscription;
  public medicoCargado$ = new BehaviorSubject<any | null>(null);

  diaAsistencia: WritableSignal<string> = signal("08/08/2026");
  horaAsistencia: WritableSignal<string> = signal("16:30 Hrs.");
  /**
   * 1: mostrar QR
   * 2: mostrar datos aspirante
   */
  estatusAssitencia: WritableSignal<number> = signal(1);

  especialidades: string[] = ["Cardiología", "Anestesiología pediátrica", "Neumología"];

  data: any = {
    fecha: "15 de Mayo, 2025",
    hora: "07:00 Hrs.",
    mesa: "5",
    turno: "11:00 a 13:00 hrs."
  }

  constructor() {
    this.medicoCargado$.subscribe(medicoCargado => {
      if (medicoCargado) {
        this.cargarDatos(medicoCargado);
      }
    })
  }

  cargarDatos(medicoCargado: any) {
    this.timerSubscription?.unsubscribe();

    this.datosMedico.set(medicoCargado);

    this.timerSubscription = timer(40000).subscribe(() => {
      this.resetearVista();
    });
  }

  resetearVista() {
    this.datosMedico.set(null);
    this.timerSubscription?.unsubscribe();
  }

  ngOnDestroy() {
    this.timerSubscription?.unsubscribe();
  }

  handleNuevEscaneo() {
    this.resetearVista();
  }
}
