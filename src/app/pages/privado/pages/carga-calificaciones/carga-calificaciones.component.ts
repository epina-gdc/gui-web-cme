import {Component, computed, OnInit, signal, WritableSignal} from '@angular/core';
import {Button} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {RespuestaCalificaciones} from '@models/respuesta-calificaciones.interface';
import {CargaCalificacionesService} from '@services/carga-calificaciones.service';
import {AlertService} from '@services/alert.service';


@Component({
  selector: 'app-carga-calificaciones',
  imports: [
    Button,
    DialogModule,
    CommonModule
  ],
  templateUrl: './carga-calificaciones.component.html',
  styleUrl: './carga-calificaciones.component.scss',
})
export class CargaCalificacionesComponent implements OnInit {

  confCargaCalificaciones: boolean = false;
  errorCalificaciones: boolean = false;

  tipoEstatus: { estatus: number, descripcion: string }[] = [
    {estatus: 1, descripcion: 'Procesando...'},
    {estatus: 2, descripcion: 'Completado'},
    {estatus: 3, descripcion: 'Proceso interrumpido'},
  ];

  porcentaje: WritableSignal<number> = signal(0);
  estatus: WritableSignal<number> = signal(3);

  textoEstatus = computed(() => {
    return this.tipoEstatus
      .find(x => x.estatus === this.estatus())
      ?.descripcion ?? '';
  });

  calificaciones: RespuestaCalificaciones = {
    fechaInicioFormateada: "--/--/----",
    horaInicioFormateada: "--:--",
    fechaFinFormateada: "--/--/----",
    horaFinFormateada: "--:--",
    numConCalificacion: 0,
    numSinCalificacion: 0,
    porcentaje: 0
  };

  constructor(private readonly activatedRoute: ActivatedRoute,
              private readonly cargaCalificacionesService: CargaCalificacionesService,
              private readonly alertaService: AlertService) {
    this.obtenerInformacion();

  }

  obtenerInformacion() {
    this.activatedRoute.data.subscribe(({respuesta: valores}) => {
      this.calificaciones = valores.registro.respuesta;
      this.errorCalificaciones = valores.huboError;
      this.porcentaje.update(() => this.calificaciones.porcentaje);
    });
  }

  guardarCalificaciones() {
    this.cargaCalificacionesService.registrarCargaCalificaciones().subscribe({
      next: (respuesta) => {
        if (!respuesta.exito) {
          this.alertaService.error(respuesta.mensaje);
          return;
        }
        this.alertaService.exito('')
      },
      error: (error) => {
        const msg = error?.error?.mensaje || error?.message || 'Error desconocido';
        this.alertaService.error(msg);
      }
    })
  }

  ngOnInit() {

    this.estatus.set(1);

    const intervalo = setInterval(() => {
      if (this.porcentaje() < 100) {
        this.porcentaje.update((a) => a + 1);
      } else {
        clearInterval(intervalo);
        this.estatus.set(2);
      }
    }, 50);
  }


  listaProcesoAutomatico: string[] = [
    "Se consulta el servicio API proporcionado por el área médica",
    "Si ya existe información, se actualiza automáticamente",
    "No se requiere intervención adicional del usuario",
    "Si existe una interrupción en el proceso de carga, intentar nuevamente.\n Si el error persiste comunícate con el administrador del sistema."
  ];

}
