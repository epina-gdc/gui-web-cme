import {Component, OnDestroy, signal, WritableSignal} from '@angular/core';
import {CardModule} from 'primeng/card';
import {Button} from 'primeng/button';
import {BehaviorSubject, Subscription, timer} from 'rxjs';
import {AsistenciaService} from '@services/asistencia.service';
import {AlertService} from '@services/alert.service';
import {UsuarioAsistencia} from '@models/asistencia.interface';

@Component({
  selector: 'app-visualizacion-asistencia',
  imports: [CardModule, Button],
  templateUrl: './visualizacion-asistencia.component.html',
  styleUrl: './visualizacion-asistencia.component.scss'
})
export class VisualizacionAsistenciaComponent implements OnDestroy {

  datosMedico = signal<UsuarioAsistencia | null>(null);
  private timerSubscription?: Subscription;
  public medicoCargado$ = new BehaviorSubject<UsuarioAsistencia | null>(null);

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

  constructor(private asistenciaService: AsistenciaService,
              private alerService: AlertService) {
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

  confirmarFolio() {
    const folios  = ['A7654321', '']
    const folio: string = '25D0100121';
    this.asistenciaService.obtenerCita(folio).subscribe({
      next: respuesta => {
        if (!respuesta.exito) {
          this.alerService.error(respuesta.mensaje);
          return;
        }
        this.alerService.exito(respuesta.mensaje);
        this.datosMedico.set(respuesta.respuesta);

      },
      error: error => {
        console.log(error);
        this.alerService.error(error.error);
        this.resetearVista();
      }
    })
  }
}
