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
import { ErrorCargaPlaza, RespuestaCargaPlaza } from '@models/respuesta-carga-plaza.interface';
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
  arrastrando: WritableSignal<boolean> = signal<boolean>(false);
  cargaEnProceso: WritableSignal<boolean> = signal<boolean>(false);
  plazasAsignadas: WritableSignal<boolean> = signal<boolean>(false);
  erroresCarga: WritableSignal<ErrorCargaPlaza[]> = signal<ErrorCargaPlaza[]>([]);

  carga: RespuestaCargaPlaza = this.obtenerCargaInicial();

  readonly listaImportante: string[] = [
    'Al realizar la carga de las plazas, si ya existen plazas cargadas estas seran eliminadas para cargar las nuevas plazas.',
    'Si ya existen plazas asignadas, ya no es posible realizar la carga de plazas.',
  ];

  ngOnInit(): void {
    this.cargarConvocatorias();

    this.form.get('convocatoria')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((idConvocatoria: number | null) => {
        this.archivoSeleccionado.set(null);
        this.erroresCarga.set([]);
        this.carga = this.obtenerCargaInicial();

        if (!idConvocatoria) return;

        this.consultarUltimaCarga(idConvocatoria);
      });
  }

  cargarConvocatorias(): void {
    this._CatalogoGenService.getConvocatorias()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta) => {
          const convocatorias = (respuesta?.respuesta ?? []) as Convocatoria[];

          this.options = convocatorias
            .filter((item: Convocatoria) => item.tipo?.idTipoConvocatoria === 1)
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
          if (respuesta?.exito && respuesta.respuesta) {
            this.procesarRespuesta(respuesta.respuesta);
            return;
          }

          this.carga = this.obtenerCargaInicial();
        },
        error: () => {
          this.carga = this.obtenerCargaInicial();
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
      && !this.cargaEnProceso()
      && !this.plazasAsignadas();
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

  obtenerPlazaError(error: ErrorCargaPlaza): string {
    return String(error.idPlaza ?? error.noPlaza ?? '-');
  }

  obtenerOoadError(error: ErrorCargaPlaza): string {
    return String(error.ooad ?? error.cveOoad ?? '-');
  }

  private prepararArchivo(archivo: File | null): void {
    if (!archivo) return;

    if (!this.validarPuedeAdjuntar()) return;

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

    if (this.cargaEnProceso()) {
      this._alertServices.alerta('Existe un proceso de carga en ejecucion. Intenta nuevamente mas tarde.');
      return false;
    }

    if (this.plazasAsignadas()) {
      this._alertServices.alerta('No es posible cargar plazas porque ya existen plazas asignadas.');
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
    const idConvocatoria = this.form.get('convocatoria')?.value as number | null;
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
          if (!respuesta?.exito) {
            this.cargaEnProceso.set(false);
            this._alertServices.error(respuesta?.mensaje || this._Mensajes.MSG031);
            return;
          }

          this.archivoSeleccionado.set(null);
          this._alertServices.exito(respuesta.mensaje || this._Mensajes.MSG030);
          this.consultarUltimaCarga(idConvocatoria);
        },
        error: (error) => {
          this.cargaEnProceso.set(false);
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
    this.plazasAsignadas.set(Boolean(data.tienePlazasAsignadas));
  }

  private obtenerCargaInicial(): RespuestaCargaPlaza {
    this.cargaEnProceso.set(false);
    this.plazasAsignadas.set(false);

    return {
      fechaInicioFormateada: '-',
      horaInicioFormateada: '-',
      fechaFinFormateada: '-',
      horaFinFormateada: '-',
      totalPlazasOfertadas: null,
      totalPlazasCredito: null,
      idEstatusCarga: 0,
    };
  }

  private esArchivoExcel(archivo: File): boolean {
    const extension = archivo.name.split('.').pop()?.toLowerCase();

    return extension === 'xlsx' || extension === 'xls';
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