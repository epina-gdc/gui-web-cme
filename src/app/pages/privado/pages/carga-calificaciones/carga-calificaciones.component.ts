import {Component, computed, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {Button} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {RespuestaCalificaciones} from '@models/respuesta-calificaciones.interface';
import {CargaCalificacionesService} from '@services/carga-calificaciones.service';
import {AlertService} from '@services/alert.service';
import {Card} from 'primeng/card';
import {Subject, switchMap, timer} from 'rxjs';
import {takeUntil} from 'rxjs/operators';


@Component({
  selector: 'app-carga-calificaciones',
  imports: [
    Button,
    DialogModule,
    CommonModule,
    Card
  ],
  templateUrl: './carga-calificaciones.component.html',
  styleUrl: './carga-calificaciones.component.scss',
})
export class CargaCalificacionesComponent implements OnInit, OnDestroy {

  confCargaCalificaciones: boolean = false;
  errorCalificaciones: boolean = false;

  private destroy$ = new Subject<void>();
  private readonly INTERVALO_REFRESCO = 30000;

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
    this.iniciarRefrescoAutomatico();
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

  iniciarRefrescoAutomatico() {
    timer(this.INTERVALO_REFRESCO, this.INTERVALO_REFRESCO)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.cargaCalificacionesService.consultaCargaCalificaciones())
      )
      .subscribe({
        next: (res) => {
          if (!res.error) {
            this.procesarRespuesta(res.respuesta);
          }
        },
        error: (err) => console.error('Error en refresco automático', err)
      });
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

  private procesarRespuesta(data: RespuestaCalificaciones) {
    if (data) {
      this.calificaciones = data;
      this.porcentaje.set(data.porcentaje);
      if (data.porcentaje === 100) {
        this.estatus.set(2);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  listaProcesoAutomatico: string[] = [
    "Se consulta el servicio API proporcionado por el área médica",
    "Si ya existe información, se actualiza automáticamente",
    "No se requiere intervención adicional del usuario",
    "Si existe una interrupción en el proceso de carga, intentar nuevamente.\n Si el error persiste comunícate con el administrador del sistema."
  ];

}
