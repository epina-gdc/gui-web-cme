import {Component, computed, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {Button} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {RespuestaCalificaciones} from '@models/respuesta-calificaciones.interface';
import {CargaCalificacionesService} from '@services/carga-calificaciones.service';
import {AlertService} from '@services/alert.service';
import {Card} from 'primeng/card';
import {forkJoin, Observable, of, Subject, switchMap, timer} from 'rxjs';
import {catchError, filter, takeUntil} from 'rxjs/operators';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Select} from 'primeng/select';
import {TipoDropdown} from '@models/tipo-dropdown.interface';
import {Convocatoria} from '@models/convocatoria.interface';


@Component({
  selector: 'app-carga-calificaciones',
  imports: [
    Button,
    DialogModule,
    CommonModule,
    Card,
    ReactiveFormsModule,
    Select
  ],
  templateUrl: './carga-calificaciones.component.html',
  styleUrl: './carga-calificaciones.component.scss',
})
export class CargaCalificacionesComponent implements OnInit, OnDestroy {


  options: TipoDropdown[] = [
    {value: 1, label: 'A'},
    {value: 2, label: 'B'},
    {value: 3, label: 'C'},
    {value: 4, label: 'D'},
  ];

  confCargaCalificaciones: boolean = false;
  errorCalificaciones: boolean = false;

  private destroy$ = new Subject<void>();
  private stopTimer$ = new Subject<void>();

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

  form!: FormGroup;

  constructor(private readonly activatedRoute: ActivatedRoute,
              private readonly cargaCalificacionesService: CargaCalificacionesService,
              private readonly alertaService: AlertService,
              private readonly fb: FormBuilder) {
    this.form = this.inicializarForm();
    this.obtenerInformacion();
    this.iniciarRefrescoAutomatico();
  }

  inicializarForm(): FormGroup {
    return this.fb.group({
      convocatoria: [null],
    })
  }

  obtenerInformacion() {
    this.activatedRoute.data.subscribe(({respuesta}) => {
      this.options = respuesta.respuesta.filter((item: Convocatoria) => item.tipo.idTipoConvocatoria === 1)
        .map((item: Convocatoria) => ({
          value: item.idConvocatoria,
          label: item.desConvocatoria
        }));
    });
  }

  guardarCalificaciones() {
    const id = this.form.get('convocatoria')?.value;
    if (!id) return;
    this.cargaCalificacionesService.registrarCargaCalificaciones(id).subscribe({
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
    const id = this.form.get('convocatoria')?.value;
    if (!id) return;
    timer(this.INTERVALO_REFRESCO, this.INTERVALO_REFRESCO)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.cargaCalificacionesService.consultaCargaCalificaciones(id))
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
    this.form.get('convocatoria')?.valueChanges.pipe(
      takeUntil(this.destroy$),
      filter(id => !!id)
    ).subscribe(id => {
      this.cargarDatosPorId(id);
      this.reiniciarRefrescoAutomatico(id);
    });
  }

  cargarDatosPorId(id: number) {
    const handlePipeError = (obs$: Observable<any>) => obs$.pipe(
      catchError((error) => {
        const msg = error?.error?.mensaje || error?.message || 'Error desconocido';
        return of({ error: true, msg });
      })
    );

    forkJoin([
      handlePipeError(this.cargaCalificacionesService.obtenerValidacionCalificaciones(id)),
      handlePipeError(this.cargaCalificacionesService.consultaCargaCalificaciones(id))
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([validaciones, registro]) => {
      const errores: string[] = [];

      if (validaciones.error) errores.push(validaciones.msg);
      if (registro.error) errores.push(registro.msg);

      if (!validaciones.error && !validaciones.exito) {
        errores.push(validaciones.mensaje || 'Error de validación');
      } else if (!validaciones.error && validaciones.exito) {
      }

      if (errores.length > 0) {
        const mensajesUnicos = [...new Set(errores)];
        mensajesUnicos.forEach(m => this.alertaService.error(m));
        this.errorCalificaciones = true;
      }

      if (!registro.error && registro.respuesta) {
        this.procesarRespuesta(registro.respuesta);
      }
    });
  }

  reiniciarRefrescoAutomatico(id: number) {
    this.stopTimer$.next();

    timer(this.INTERVALO_REFRESCO, this.INTERVALO_REFRESCO)
      .pipe(
        takeUntil(this.destroy$),
        takeUntil(this.stopTimer$),
        switchMap(() => this.cargaCalificacionesService.consultaCargaCalificaciones(id))
      )
      .subscribe({
        next: (res) => {
          if (res && !res.error) {
            this.procesarRespuesta(res.respuesta);
          }
        },
        error: (err) => console.error('Error en refresco automático', err)
      });
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
