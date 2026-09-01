import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Card } from 'primeng/card';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { Select } from 'primeng/select';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { GeneralComponent } from '@components/general.component';
import { Convocatoria } from '@models/convocatoria.interface';
import { ErrorCargaPlaza, RespuestaCargaPlaza, RespuestaRegistroCargaPlaza } from '@models/respuesta-carga-plaza.interface';
import { TipoDropdown } from '@models/tipo-dropdown.interface';
import { CargaPlazaService } from '@services/carga-plaza.service';

@Component({
  selector: 'app-carga-plaza',
  standalone: true,
  imports: [
    Card,
    CommonModule,
    ConfirmDialog,
    ReactiveFormsModule,
    Select,
  ],
  templateUrl: './carga-plaza.component.html',
  styleUrl: './carga-plaza.component.scss',
  providers: [ConfirmationService],
})
export class CargaPlazaComponent extends GeneralComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly cargaPlazaService: CargaPlazaService = inject(CargaPlazaService);
  private readonly confirmationService: ConfirmationService = inject(ConfirmationService);
  private readonly destroy$ = new Subject<void>();

  form: FormGroup = this.fb.group({
    convocatoria: [null, Validators.required],
  });

  options: TipoDropdown[] = [];
  archivoSeleccionado: WritableSignal<File | null> = signal<File | null>(null);
  cargando: WritableSignal<boolean> = signal<boolean>(false);
  validandoPlazas: WritableSignal<boolean> = signal<boolean>(false);
  arrastrando: WritableSignal<boolean> = signal<boolean>(false);
  cargaEnProceso: WritableSignal<boolean> = signal<boolean>(false);
  plazasOcupadas: WritableSignal<boolean> = signal<boolean>(false);
  erroresCarga: WritableSignal<ErrorCargaPlaza[]> = signal<ErrorCargaPlaza[]>([]);

  carga: RespuestaCargaPlaza = this.obtenerCargaInicial();

  readonly listaImportante: string[] = [
    'Al realizar la carga de las plazas, si ya existen plazas cargadas estas seran eliminadas para cargar las nuevas plazas.',
    'Si ya existen plazas ocupadas, ya no es posible realizar la carga de plazas.',
  ];

  ngOnInit(): void {
    this.cargarConvocatorias();

    this.form.get('convocatoria')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((idConvocatoria: number | null) => {
        this.reiniciarEstadoConvocatoria();

        const id = Number(idConvocatoria);
        if (!id) return;

        this.consultarUltimaCarga(id);
        this.consultarValidacionPlazasOcupadas(id);
      });
  }

  cargarConvocatorias(): void {
    this._CatalogoGenService.getConvocatorias()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta) => {
          const convocatorias = (respuesta?.respuesta ?? []) as Convocatoria[];

          this.options = convocatorias
            .map((item: Convocatoria) => ({
              value: item.idConvocatoria,
              label: item.desConvocatoria,
            }));
        },
        error: () => this._alertServices.error('No fue posible cargar las convocatorias.'),
      });
  }

  consultarUltimaCarga(idConvocatoria: number): void {
    this.cargaPlazaService.consultarCargaPlazas(idConvocatoria)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta) => {
          if (!this.esConvocatoriaActual(idConvocatoria)) return;

          if (respuesta?.exito && respuesta.respuesta) {
            this.procesarRespuesta(respuesta.respuesta);
            return;
          }

          this.carga = this.obtenerCargaInicial();
          this.cargaEnProceso.set(false);
        },
        error: () => {
          if (!this.esConvocatoriaActual(idConvocatoria)) return;

          this.carga = this.obtenerCargaInicial();
          this.cargaEnProceso.set(false);
        },
      });
  }

  abrirSelectorArchivo(): void {
    if (!this.validarPuedeAdjuntar()) return;

    this.fileInput?.nativeElement.click();
  }

  onSeleccionarArchivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0] ?? null;
    this.prepararArchivo(archivo);
    input.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (!this.puedeAdjuntarArchivo()) return;

    this.arrastrando.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.arrastrando.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.arrastrando.set(false);

    const archivo = event.dataTransfer?.files?.[0] ?? null;
    this.prepararArchivo(archivo);
  }

  puedeAdjuntarArchivo(): boolean {
    return Boolean(this.form.get('convocatoria')?.value)
      && !this.cargando()
      && !this.validandoPlazas()
      && !this.cargaEnProceso()
      && !this.plazasOcupadas();
  }

  formatearTotal(valor?: number | null): string {
    return typeof valor === 'number' ? valor.toLocaleString('es-MX') : '-';
  }

  formatearPeso(bytes: number): string {
    if (bytes === 0) return '0 KB';

    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;

    return `${(kb / 1024).toFixed(1)} MB`;
  }

  obtenerRegistroError(error: ErrorCargaPlaza): string {
    return String(error.registro ?? error.numFila ?? '-');
  }

  obtenerPlazaError(error: ErrorCargaPlaza): string {
    return String(error.noPlaza ?? error.numPlaza ?? error.idPlaza ?? '-');
  }

  obtenerOoadError(error: ErrorCargaPlaza): string {
    return String(error.ooad ?? error.descOoad ?? error.cveOoad ?? '-');
  }

  private consultarValidacionPlazasOcupadas(idConvocatoria: number): void {
    this.validandoPlazas.set(true);

    this.cargaPlazaService.validarPlazasOcupadas(idConvocatoria)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          if (this.esConvocatoriaActual(idConvocatoria)) {
            this.validandoPlazas.set(false);
          }
        })
      )
      .subscribe({
        next: (respuesta) => {
          if (!this.esConvocatoriaActual(idConvocatoria)) return;

          if (!respuesta?.exito || !respuesta.respuesta) {
            this.plazasOcupadas.set(false);
            return;
          }

          const validacion = respuesta.respuesta;
          const existenPlazasOcupadas = Boolean(
            validacion.existenPlazasOcupadas || validacion.puedeIniciarProceso === false
          );

          this.plazasOcupadas.set(existenPlazasOcupadas);

          if (existenPlazasOcupadas) {
            this.archivoSeleccionado.set(null);
            this._alertServices.alerta(this.obtenerMensajePlazasOcupadas(validacion.totalPlazasOcupadas));
          }
        },
        error: () => {
          if (!this.esConvocatoriaActual(idConvocatoria)) return;

          this.plazasOcupadas.set(false);
          this._alertServices.error('No fue posible validar si existen plazas ocupadas.');
        },
      });
  }

  private prepararArchivo(archivo: File | null): void {
    if (!archivo) return;

    if (!this.validarPuedeAdjuntar()) return;

    if (archivo.size === 0) {
      this._alertServices.error('El archivo no debe estar vacio.');
      return;
    }

    if (!this.esArchivoExcel(archivo)) {
      this._alertServices.error('Solo se permiten archivos en formato .xlsx o .xls.');
      return;
    }

    this.archivoSeleccionado.set(archivo);
    this.abrirModalCarga();
  }

  private validarPuedeAdjuntar(): boolean {
    if (!this.form.get('convocatoria')?.value) {
      this._alertServices.alerta('Selecciona una convocatoria antes de adjuntar el archivo.');
      return false;
    }

    if (this.validandoPlazas()) {
      this._alertServices.alerta('Espera a que termine la validacion de plazas ocupadas.');
      return false;
    }

    if (this.cargaEnProceso()) {
      this._alertServices.alerta('Existe un proceso de carga en ejecucion. Intenta nuevamente mas tarde.');
      return false;
    }

    if (this.plazasOcupadas()) {
      this._alertServices.alerta(this.obtenerMensajePlazasOcupadas());
      return false;
    }

    return true;
  }

  private abrirModalCarga(): void {
    this.confirmationService.confirm({
      message: '\u00bfEst\u00e1 seguro de iniciar la carga de plazas?',
      header: ' ',
      acceptLabel: 'S\u00ed, confirmar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'btn-modal-confirmar',
      rejectButtonStyleClass: 'btn-modal-cancelar',
      accept: () => this.cargarArchivo(),
      reject: () => this.archivoSeleccionado.set(null),
    });
  }

  private cargarArchivo(): void {
    const idConvocatoria = Number(this.form.get('convocatoria')?.value);
    const archivo = this.archivoSeleccionado();

    if (!idConvocatoria || !archivo) return;

    this.cargando.set(true);
    this.cargaEnProceso.set(true);
    this.erroresCarga.set([]);

    this.cargaPlazaService.registrarCargaPlazas(idConvocatoria, archivo)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.cargando.set(false))
      )
      .subscribe({
        next: (respuesta) => {
          if (!this.esConvocatoriaActual(idConvocatoria)) return;

          this.erroresCarga.set(this.obtenerErroresCarga(respuesta?.respuesta ?? null));

          if (!respuesta?.exito) {
            this.cargaEnProceso.set(false);
            this._alertServices.error(respuesta?.mensaje || this._Mensajes.MSG031);
            return;
          }

          this.cargaEnProceso.set(false);
          this.archivoSeleccionado.set(null);
          this.actualizarResumenCargaLayout(respuesta.respuesta);
          this._alertServices.exito(respuesta.mensaje || this._Mensajes.MSG030);
          this.consultarUltimaCarga(idConvocatoria);
          this.consultarValidacionPlazasOcupadas(idConvocatoria);
        },
        error: (error) => {
          if (!this.esConvocatoriaActual(idConvocatoria)) return;

          this.cargaEnProceso.set(false);
          this.erroresCarga.set(this.obtenerErroresHttp(error));
          this._alertServices.error(this.obtenerMensajeError(error));
        },
      });
  }

  private procesarRespuesta(data: RespuestaCargaPlaza): void {
    this.carga = {
      ...this.obtenerCargaInicial(),
      ...data,
    };

    this.cargaEnProceso.set(Boolean(data.procesoEnEjecucion || data.idEstatusCarga === 1));

    if (data.tienePlazasOcupadas !== undefined) {
      this.plazasOcupadas.set(Boolean(data.tienePlazasOcupadas));
      return;
    }

    if (data.tienePlazasAsignadas !== undefined) {
      this.plazasOcupadas.set(Boolean(data.tienePlazasAsignadas));
    }
  }

  private obtenerCargaInicial(): RespuestaCargaPlaza {
    return {
      nombreArchivo: null,
      fechaInicioFormateada: '-',
      horaInicioFormateada: '-',
      fechaFinFormateada: '-',
      horaFinFormateada: '-',
      totalRegistros: null,
      totalRegistrosValidos: null,
      totalRegistrosRechazados: null,
      totalPlazasOfertadas: null,
      totalPlazasCredito: null,
      idEstatusCarga: 0,
      procesoEnEjecucion: false,
      errores: [],
    };
  }

  private actualizarResumenCargaLayout(data?: RespuestaRegistroCargaPlaza | null): void {
    if (!data) return;

    this.carga = {
      ...this.carga,
      totalRegistros: data.totalRegistros ?? this.carga.totalRegistros ?? null,
      totalRegistrosRechazados: data.totalErrores ?? this.carga.totalRegistrosRechazados ?? null,
      totalPlazasOfertadas: data.totalPlazasOfertadas ?? this.carga.totalPlazasOfertadas,
      totalPlazasCredito: data.totalPlazasConCredito ?? this.carga.totalPlazasCredito,
    };
  }

  private obtenerErroresCarga(data?: RespuestaRegistroCargaPlaza | null): ErrorCargaPlaza[] {
    return this.normalizarErroresCarga(data?.plazasConError ?? []);
  }

  private obtenerErroresHttp(error: unknown): ErrorCargaPlaza[] {
    const detalle = error as { error?: { respuesta?: RespuestaRegistroCargaPlaza } };
    return this.obtenerErroresCarga(detalle?.error?.respuesta ?? null);
  }

  private normalizarErroresCarga(errores: ErrorCargaPlaza[]): ErrorCargaPlaza[] {
    return errores.map((error) => ({
      ...error,
      registro: error.registro ?? error.numFila,
      noPlaza: error.noPlaza ?? error.numPlaza,
      ooad: error.ooad ?? error.descOoad ?? (error.cveOoad != null ? String(error.cveOoad) : undefined),
      mensaje: error.mensaje ?? this.obtenerMensajeRegistro(error),
    }));
  }

  private obtenerMensajeRegistro(error: ErrorCargaPlaza): string {
    if (Array.isArray(error.errores) && error.errores.length > 0) {
      return error.errores.join(' ');
    }

    return error.mensaje ?? '';
  }

  private reiniciarEstadoConvocatoria(): void {
    this.archivoSeleccionado.set(null);
    this.erroresCarga.set([]);
    this.carga = this.obtenerCargaInicial();
    this.cargaEnProceso.set(false);
    this.plazasOcupadas.set(false);
    this.validandoPlazas.set(false);
  }

  private obtenerMensajePlazasOcupadas(total?: number | null): string {
    const totalPlazas = typeof total === 'number' && total > 0 ? ` Total: ${total}.` : '';
    return `No es posible realizar la carga, ya existen plazas ocupadas para la convocatoria proporcionada.${totalPlazas}`;
  }

  private esArchivoExcel(archivo: File): boolean {
    const extension = archivo.name.split('.').pop()?.toLowerCase();

    return extension === 'xlsx' || extension === 'xls';
  }

  private esConvocatoriaActual(idConvocatoria: number): boolean {
    return Number(this.form.get('convocatoria')?.value) === idConvocatoria;
  }

  private obtenerMensajeError(error: unknown): string {
    const detalle = error as { error?: { mensaje?: string }, message?: string };
    return detalle?.error?.mensaje || detalle?.message || this._Mensajes.MSG031;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
