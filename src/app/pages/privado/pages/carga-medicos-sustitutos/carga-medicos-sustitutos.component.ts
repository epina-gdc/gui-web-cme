import {CommonModule} from '@angular/common';
import {Component, computed, DestroyRef, inject, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {CargaSustitutosResponse, EstadoCargaSustitutos} from '@models/carga-sustitutos.interface';
import {Convocatoria} from '@models/convocatoria.interface';
import {TipoDropdown} from '@models/tipo-dropdown.interface';
import {AlertService} from '@services/alert.service';
import {CargaCalificacionesService} from '@services/carga-calificaciones.service';
import {ConfirmationService} from 'primeng/api';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {Select} from 'primeng/select';
import {EMPTY, Subject, timer} from 'rxjs';
import {catchError, exhaustMap, finalize, takeUntil} from 'rxjs/operators';

const CARGA_SUSTITUTOS_INICIAL: CargaSustitutosResponse = {
  idControlCargaSustituto: null,
  idConvocatoria: null,
  estado: null,
  fechaInicio: null,
  fechaFin: null,
  totalRegistros: 0,
  totalOoad: 0,
  ooadProcesadas: 0,
  porcentajeAvance: 0,
  mensajeResultado: null
};

@Component({
  selector: 'app-carga-medicos-sustitutos',
  imports: [
    Button,
    CommonModule,
    Card,
    ReactiveFormsModule,
    Select,
    ConfirmDialog
  ],
  templateUrl: './carga-medicos-sustitutos.component.html',
  styleUrl: './carga-medicos-sustitutos.component.scss',
})
export class CargaMedicosSustitutosComponent implements OnInit, OnDestroy {
  private readonly ID_TIPO_CONVOCATORIA_MINIDRAFT = 2;
  private readonly DES_TIPO_CONVOCATORIA_MINIDRAFT = 'MINIDRAFT';
  private readonly INTERVALO_POLLING = 3000;

  private readonly destroyRef = inject(DestroyRef);
  private readonly stopPolling$ = new Subject<void>();

  options: TipoDropdown[] = [];
  form: FormGroup;

  idConvocatoriaSeleccionada: WritableSignal<number | null> = signal(null);
  carga: WritableSignal<CargaSustitutosResponse> = signal({...CARGA_SUSTITUTOS_INICIAL});
  estado: WritableSignal<EstadoCargaSustitutos | null> = signal(null);
  enviandoInicio: WritableSignal<boolean> = signal(false);
  consultandoEstado: WritableSignal<boolean> = signal(false);
  consultaInicialCompletada: WritableSignal<boolean> = signal(false);
  pollingActivo: WritableSignal<boolean> = signal(false);

  private finalizacionNotificada = false;
  private interrupcionNotificada = false;

  textoEstatus = computed(() => {
    switch (this.estado()) {
      case 'EN PROCESO':
        return 'Carga en proceso';
      case 'FINALIZADO':
        return 'Carga finalizada';
      case 'INTERRUMPIDO':
        return 'Proceso interrumpido';
      default:
        return '';
    }
  });

  porcentaje = computed(() => this.normalizarPorcentaje(this.carga().porcentajeAvance));

  claseBarraProgreso = computed(() => ({
    'interrumpido': this.estado() === 'INTERRUMPIDO',
    'completado': this.estado() === 'FINALIZADO',
    'progress-bar': this.estado() === 'EN PROCESO' || this.estado() === null
  }));

  botonDeshabilitado = computed(() => {
    return !this.idConvocatoriaSeleccionada()
      || this.enviandoInicio()
      || this.consultandoEstado()
      || !this.consultaInicialCompletada()
      || this.estado() === 'EN PROCESO';
  });

  listaProcesoAutomatico: string[] = [
    'Se consulta el servicio SIAP.',
    'Si ya existen médicos insertados, se elimina la información y se realiza la carga nuevamente.',
    'No requiere intervención del usuario.',
    'En caso de error, se puede reintentar.',
    'Si falla constantemente, contactar a soporte.'
  ];

  constructor(private readonly activatedRoute: ActivatedRoute,
              private readonly cargaCalificacionesService: CargaCalificacionesService,
              private readonly alertaService: AlertService,
              private readonly fb: FormBuilder,
              private readonly confirmationService: ConfirmationService) {
    this.form = this.inicializarForm();
  }

  ngOnInit(): void {
    this.obtenerInformacion();
    this.suscribirCambioConvocatoria();
  }

  ngOnDestroy(): void {
    this.detenerPolling();
    this.stopPolling$.complete();
  }

  inicializarForm(): FormGroup {
    return this.fb.group({
      convocatoria: [null],
    });
  }

  abrirModal(): void {
    if (this.botonDeshabilitado()) {
      return;
    }

    this.confirmationService.confirm({
      message: '¿Estás seguro de iniciar la carga de información de médicos sustitutos?',
      header: ' ',
      acceptLabel: 'Sí, confirmar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'btn-modal-confirmar',
      rejectButtonStyleClass: 'btn-modal-cancelar',
      accept: () => {
        this.iniciarCargaSustitutos();
      }
    });
  }

  private obtenerInformacion(): void {
    this.activatedRoute.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({respuesta}) => {
        const convocatorias = Array.isArray(respuesta?.respuesta)
          ? respuesta.respuesta as Convocatoria[]
          : [];

        this.options = convocatorias
          .filter((item: Convocatoria) => this.esConvocatoriaMiniDraft(item))
          .map((item: Convocatoria) => ({
            value: item.idConvocatoria,
            label: item.desConvocatoria
          }));
      });
  }

  private suscribirCambioConvocatoria(): void {
    this.form.get('convocatoria')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: unknown) => {
        const idConvocatoria = this.obtenerNumero(value);
        this.idConvocatoriaSeleccionada.set(idConvocatoria);
        this.reiniciarEstado(idConvocatoria);

        if (idConvocatoria !== null) {
          this.consultarEstadoInicial(idConvocatoria);
        }
      });
  }

  private consultarEstadoInicial(idConvocatoria: number): void {
    this.consultandoEstado.set(true);

    this.cargaCalificacionesService.consultarCargaSustitutos(idConvocatoria)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.consultandoEstado.set(false))
      )
      .subscribe({
        next: (response) => {
          if (!response.exito) {
            this.consultaInicialCompletada.set(false);
            this.alertaService.error(response.mensaje);
            return;
          }

          this.consultaInicialCompletada.set(true);
          this.procesarRespuesta(response.respuesta, true);
        },
        error: (error) => {
          const msg = error?.error?.mensaje || error?.message || 'No fue posible consultar el estado de la carga.';
          this.consultaInicialCompletada.set(false);
          this.alertaService.error(msg);
        }
      });
  }

  private iniciarCargaSustitutos(): void {
    const idConvocatoria = this.idConvocatoriaSeleccionada();
    if (idConvocatoria === null) {
      return;
    }

    this.enviandoInicio.set(true);
    this.finalizacionNotificada = false;
    this.interrupcionNotificada = false;

    this.cargaCalificacionesService.cargarSustitutos(idConvocatoria)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.enviandoInicio.set(false))
      )
      .subscribe({
        next: (response) => {
          if (!response.exito) {
            this.alertaService.error(response.mensaje);
            return;
          }

          this.consultaInicialCompletada.set(true);
          this.procesarRespuesta(response.respuesta, false);

          if (response.respuesta?.estado === 'EN PROCESO') {
            this.alertaService.exito('Se inició la carga de médicos sustitutos.');
          }
        },
        error: (error) => {
          const msg = error?.error?.mensaje || error?.message || 'No fue posible iniciar la carga de médicos sustitutos.';
          this.alertaService.error(msg);
        }
      });
  }

  private iniciarPolling(idConvocatoria: number): void {
    if (this.pollingActivo()) {
      return;
    }

    this.pollingActivo.set(true);

    timer(this.INTERVALO_POLLING, this.INTERVALO_POLLING)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        takeUntil(this.stopPolling$),
        exhaustMap(() => this.cargaCalificacionesService.consultarCargaSustitutos(idConvocatoria)
          .pipe(
            catchError((error) => {
              console.error('Error al consultar avance de médicos sustitutos', error);
              return EMPTY;
            })
          ))
      )
      .subscribe({
        next: (response) => {
          if (response.exito) {
            this.procesarRespuesta(response.respuesta, false);
          }
        },
        complete: () => this.pollingActivo.set(false)
      });
  }

  private detenerPolling(): void {
    if (this.pollingActivo()) {
      this.stopPolling$.next();
    }
    this.pollingActivo.set(false);
  }

  private procesarRespuesta(data: CargaSustitutosResponse | null, esCargaInicial: boolean): void {
    if (!data) {
      this.carga.set(this.crearCargaInicial(this.idConvocatoriaSeleccionada()));
      this.estado.set(null);
      this.detenerPolling();
      return;
    }

    const cargaNormalizada = this.normalizarCarga(data);
    this.carga.set(cargaNormalizada);
    this.estado.set(cargaNormalizada.estado);

    if (cargaNormalizada.estado === 'EN PROCESO') {
      const idConvocatoria = cargaNormalizada.idConvocatoria ?? this.idConvocatoriaSeleccionada();
      if (idConvocatoria !== null) {
        this.iniciarPolling(idConvocatoria);
      }
      return;
    }

    if (cargaNormalizada.estado === 'FINALIZADO') {
      this.detenerPolling();
      if (!esCargaInicial && !this.finalizacionNotificada) {
        this.finalizacionNotificada = true;
        this.alertaService.exito('La carga de médicos sustitutos finalizó correctamente.');
      }
      return;
    }

    if (cargaNormalizada.estado === 'INTERRUMPIDO') {
      this.detenerPolling();
      if (!esCargaInicial && !this.interrupcionNotificada) {
        this.interrupcionNotificada = true;
        this.alertaService.error(cargaNormalizada.mensajeResultado || 'El proceso de carga de médicos sustitutos fue interrumpido.');
      }
    }
  }

  private reiniciarEstado(idConvocatoria: number | null): void {
    this.detenerPolling();
    this.finalizacionNotificada = false;
    this.interrupcionNotificada = false;
    this.consultaInicialCompletada.set(false);
    this.consultandoEstado.set(false);
    this.enviandoInicio.set(false);
    this.estado.set(null);
    this.carga.set(this.crearCargaInicial(idConvocatoria));
  }

  private crearCargaInicial(idConvocatoria: number | null): CargaSustitutosResponse {
    return {
      ...CARGA_SUSTITUTOS_INICIAL,
      idConvocatoria
    };
  }

  private normalizarCarga(data: CargaSustitutosResponse): CargaSustitutosResponse {
    return {
      idControlCargaSustituto: this.obtenerNumero(data.idControlCargaSustituto),
      idConvocatoria: this.obtenerNumero(data.idConvocatoria),
      estado: data.estado ?? null,
      fechaInicio: data.fechaInicio ?? null,
      fechaFin: data.fechaFin ?? null,
      totalRegistros: this.obtenerNumero(data.totalRegistros) ?? 0,
      totalOoad: this.obtenerNumero(data.totalOoad) ?? 0,
      ooadProcesadas: this.obtenerNumero(data.ooadProcesadas) ?? 0,
      porcentajeAvance: this.normalizarPorcentaje(data.porcentajeAvance),
      mensajeResultado: data.mensajeResultado ?? null
    };
  }

  private esConvocatoriaMiniDraft(convocatoria: Convocatoria): boolean {
    const idTipoConvocatoria = this.obtenerNumero(convocatoria.tipo?.idTipoConvocatoria);
    const desTipoConvocatoria = convocatoria.tipo?.desTipoConvocatoria?.trim().toUpperCase() ?? '';

    return idTipoConvocatoria === this.ID_TIPO_CONVOCATORIA_MINIDRAFT
      || desTipoConvocatoria === this.DES_TIPO_CONVOCATORIA_MINIDRAFT;
  }

  private normalizarPorcentaje(value: number | string | null | undefined): number {
    const porcentaje = this.obtenerNumero(value) ?? 0;
    return Math.min(100, Math.max(0, porcentaje));
  }

  private obtenerNumero(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const numero = Number(value);
    return Number.isNaN(numero) ? null : numero;
  }
}
