import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Convocatoria } from '@models/convocatoria.interface';
import { ReporteAsignacionFiltro, ReporteAsignacionRegistro } from '@models/reporte-asignacion.interface';
import { TipoDropdown } from '@models/tipo-dropdown.interface';
import { TipoAsignacion } from '@models/datosAsignacion';
import { AlertService } from '@services/alert.service';
import { AsignacionesMonitoreoService } from '@services/asignaciones-monitoreo.service';
import { ReporteAsignacionService } from '@services/reporte-asignacion.service';
import { Mensajes } from '@utils/mensajes';
import { saveAs } from 'file-saver';
import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { InputText } from 'primeng/inputtext';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { Subject } from 'rxjs';
import { distinctUntilChanged, finalize, takeUntil } from 'rxjs/operators';
import { GeneralComponent } from '@components/general.component';
import { OnlyNumbersDirective } from '@directives/only-numbers.directive';

@Component({
  selector: 'app-reporte-asignacion',
  imports: [
    Button,
    CommonModule,
    DatePicker,
    InputText,
    OnlyNumbersDirective,
    PaginatorModule,
    ReactiveFormsModule,
    Select,
    TableModule,
  ],
  templateUrl: './reporte-asignacion.component.html',
  styleUrl: './reporte-asignacion.component.scss',
})
export class ReporteAsignacionComponent extends GeneralComponent implements OnInit, OnDestroy {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly reporteAsignacionService: ReporteAsignacionService = inject(ReporteAsignacionService);
  private readonly asignacionesMonitoreoService: AsignacionesMonitoreoService = inject(AsignacionesMonitoreoService);
  private readonly alertaService: AlertService = inject(AlertService);
  private readonly mensajes: Mensajes = inject(Mensajes);
  private readonly destroy$ = new Subject<void>();
  private MSGHU052A: string = 'La fecha de inicio y la fecha de fin son obligatorios.';
  private MSGHU052B: string = 'La fecha de inicio no debe ser mayor a la fecha de fin.';
  private MSGHU052C: string = 'La fechas deben de estar dentro de la convocatoria.';

  form: FormGroup = this.fb.group({
    cveOoad: [null],
    cveZona: [null],
    idTipoAsignacion: [null],
    cveEspecialidad: [null],
    idConvocatoria: [null],
    numPlaza: ['', [Validators.maxLength(7), Validators.pattern(/^\d{0,7}$/)]],
    matriculaFolio: ['', [Validators.maxLength(10), Validators.pattern(/^\d{0,10}$/)]],
    fechaInicio: [null, Validators.required],
    fechaFin: [null, Validators.required],
  });


  ooads: TipoDropdown[] = [];
  zonas: TipoDropdown[] = [];
  tiposAsignacion: TipoDropdown[] = [];
  especialidades: TipoDropdown[] = [];
  convocatorias: TipoDropdown[] = [];
  convocatoriasCatalogo: Convocatoria[] = [];

  registros: WritableSignal<ReporteAsignacionRegistro[]> = signal<ReporteAsignacionRegistro[]>([]);
  busquedaRealizada: WritableSignal<boolean> = signal<boolean>(false);
  cargando: WritableSignal<boolean> = signal<boolean>(false);
  exportandoGeneral: WritableSignal<boolean> = signal<boolean>(false);
  exportandoDetalle: WritableSignal<boolean> = signal<boolean>(false);

  minDate?: Date;
  maxDate?: Date;
  first = 0;
  rows = 10;
  paginaActual = 0;
  totalRecords = 0;

  ngOnInit(): void {
    this.cargarCatalogos();
    this.suscribirCambiosFormulario();
  }

  onBuscar(): void {
    if (!this.validarBusqueda()) return;
    console.log('onBuscar called', this.form.value);
    this.cargando.set(true);
    this.busquedaRealizada.set(true);

    this.reporteAsignacionService.consultarReporte(this.crearFiltros(true))
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.cargando.set(false))
      )
      .subscribe({
        next: (response) => {
          const pagina = response?.respuesta;
          const registros = pagina?.content ?? [];

          this.registros.set(registros);
          this.totalRecords = pagina?.page?.totalElements ?? registros.length;

          if (!response?.exito || registros.length === 0) {
            this.alertaService.error(response?.mensaje || this.mensajes.MSG082);
          }
        },
        error: (error) => {
          this.registros.set([]);
          this.totalRecords = 0;
          this.alertaService.error(this.obtenerMensajeError(error));
        },
      });
  }

  onLimpiar(): void {
    this.form.reset({
      cveOoad: null,
      cveZona: null,
      idTipoAsignacion: null,
      cveEspecialidad: null,
      idConvocatoria: null,
      numPlaza: '',
      matriculaFolio: '',
      fechaInicio: null,
      fechaFin: null,
    });

    this.zonas = [];
    this.minDate = undefined;
    this.maxDate = undefined;
    this.first = 0;
    this.paginaActual = 0;
    this.totalRecords = 0;
    this.registros.set([]);
    this.busquedaRealizada.set(false);
  }

  onPageChange(event: PaginatorState): void {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
    this.paginaActual = event.page ?? 0;
    this.onBuscar();
  }

  onExportarGeneral(): void {
    this.exportarReporte('general');
  }

  onExportarDetalle(): void {
    this.exportarReporte('detalle');
  }

  obtenerNoOoad(registro: ReporteAsignacionRegistro): string {
    return this.obtenerValor(registro.noOoad, registro.numOoad, registro.cveOoad);
  }

  obtenerOoad(registro: ReporteAsignacionRegistro): string {
    return this.obtenerValor(registro.ooad, registro.desOoad);
  }

  obtenerClaveZona(registro: ReporteAsignacionRegistro): string {
    return this.obtenerValor(registro.claveZona, registro.cveZona);
  }

  obtenerZona(registro: ReporteAsignacionRegistro): string {
    return this.obtenerValor(registro.zona, registro.desZona);
  }

  obtenerTipoAsignacion(registro: ReporteAsignacionRegistro): string {
    return this.obtenerValor(registro.tipoAsignacion, registro.desTipoAsignacion);
  }

  obtenerEstatus(registro: ReporteAsignacionRegistro): string {
    return this.obtenerValor(registro.estatus, registro.estatusValidacion);
  }

  obtenerOoadResidencia(registro: ReporteAsignacionRegistro): string {
    return this.obtenerValor(registro.ooadResidencia, registro.desOoadResidencia);
  }

  obtenerMatriculaFolio(registro: ReporteAsignacionRegistro): string {
    return this.obtenerValor(registro.matriculaFolio, registro.matricula, registro.folio);
  }

  obtenerNombre(registro: ReporteAsignacionRegistro): string {
    return this.obtenerValor(registro.nombres, registro.nombre, registro.nombreCompleto);
  }

  obtenerClaseEstatus(registro: ReporteAsignacionRegistro): string {
    const estatus = this.normalizarTexto(this.obtenerEstatus(registro));

    if (estatus.includes('no cumple') || estatus.includes('rechaz')) return 'estatus-badge--danger';
    if (estatus.includes('cumple') || estatus.includes('asignad')) return 'estatus-badge--success';
    if (estatus.includes('pendiente')) return 'estatus-badge--warning';

    return 'estatus-badge--info';
  }

  private cargarCatalogos(): void {
    this.cargarOoads();
    this.cargarEspecialidades();
    this.cargarConvocatorias();
    this.cargarTiposAsignacion();
  }

  private cargarOoads(): void {
    this._CatalogoGenService.getLstOOADS()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.ooads = this.mapearOpciones(response?.respuesta ?? [], ['desOoad', 'descOoad', 'ooad'], ['cveOoad']);
        },
        error: () => this.alertaService.error('No fue posible cargar el catalogo de OOAD.'),
      });
  }

  private cargarEspecialidades(): void {
    this._CatalogoGenService.getCollEspecialidades()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.especialidades = this.mapearOpciones(
            response,
            ['desEspecialidad'],
            ['cveEspecialidad']
          );
        },
        error: () => this.alertaService.error('No fue posible cargar el catalogo de especialidades.'),
      });
  }

  private cargarConvocatorias(): void {
    this._CatalogoGenService.getConvocatorias()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.convocatoriasCatalogo = ((response?.respuesta ?? []) as Convocatoria[])
          this.convocatorias = [

            ...this.convocatoriasCatalogo.map((convocatoria) => ({
              label: convocatoria.desConvocatoria,
              value: convocatoria.idConvocatoria,
            })),
          ];
        },
        error: () => this.alertaService.error('No fue posible cargar las convocatorias.'),
      });
  }

  private cargarTiposAsignacion(): void {
    this.asignacionesMonitoreoService.obtenerAsignacionesPorTipo()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tiposAsignacion) => {
          const opciones = tiposAsignacion.map((tipo) => ({
            label: tipo.tipoAsignacion,
            value: tipo.idTipoAsignacion,
          }));

          this.tiposAsignacion = [...opciones];
        },
        error: () => {
          this.tiposAsignacion = [
            { label: 'Plaza ordinaria', value: TipoAsignacion.PlazaOrdinaria },
            { label: 'Plaza COPLAMAR', value: TipoAsignacion.PlazaCoplamar },
            { label: 'Sustitucion 08', value: TipoAsignacion.Sustitucion08 },
            { label: 'Cambio de rama', value: TipoAsignacion.CambioRama },
            { label: 'Rechazo de oferta', value: TipoAsignacion.RechazoOferta },
          ];
        },
      });
  }

  private suscribirCambiosFormulario(): void {
    this.form.get('cveOoad')?.valueChanges
      .pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe((cveOoad) => {
        this.form.get('cveZona')?.setValue(null, { emitEvent: false });
        this.cargarZonas(cveOoad);
      });

    this.form.get('idConvocatoria')?.valueChanges
      .pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe((idConvocatoria) => this.actualizarRangoFechas(idConvocatoria));
  }

  private cargarZonas(cveOoad: unknown): void {
    this.zonas = [];

    if (!cveOoad) return;

    this._CatalogoGenService.getZonas(String(cveOoad))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.zonas = this.mapearOpciones(
            response?.respuesta ?? [],
            ['desZona', 'descZona', 'zona'],
            ['cveZona']
          );
        },
        error: () => this.alertaService.error('No fue posible cargar el catalogo de zonas.'),
      });
  }

  private actualizarRangoFechas(idConvocatoria: unknown): void {
    const convocatoria = this.convocatoriasCatalogo.find(
      (item) => item.idConvocatoria === Number(idConvocatoria)
    );

    this.minDate = convocatoria?.fecInicio ? this.crearFecha(convocatoria.fecInicio) ?? undefined : undefined;
    this.maxDate = convocatoria?.fecFin ? this.crearFecha(convocatoria.fecFin) ?? undefined : undefined;

    this.reiniciarFechaFueraDeRango('fechaInicio');
    this.reiniciarFechaFueraDeRango('fechaFin');
  }

  private reiniciarFechaFueraDeRango(controlName: 'fechaInicio' | 'fechaFin'): void {
    const control = this.form.get(controlName);
    const fecha = this.crearFecha(control?.value);

    if (!control || !fecha) return;

    if ((this.minDate && fecha < this.minDate) || (this.maxDate && fecha > this.maxDate)) {
      control.setValue(null);
    }
  }

  private validarBusqueda(): boolean {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alertaService.error(this.MSGHU052A);
      return false;
    }

    const fechaInicio = this.crearFecha(this.form.get('fechaInicio')?.value);
    const fechaFin = this.crearFecha(this.form.get('fechaFin')?.value);

    if (!fechaInicio || !fechaFin || fechaInicio > fechaFin) {
      this.alertaService.error(this.MSGHU052B);
      return false;
    }

    if (!this.fechasDentroDeConvocatoria(fechaInicio, fechaFin)) {
      this.alertaService.error(this.MSGHU052C);
      return false;
    }

    return true;
  }

  private fechasDentroDeConvocatoria(fechaInicio: Date, fechaFin: Date): boolean {
    if (!this.form.get('idConvocatoria')?.value || !this.minDate || !this.maxDate) return true;

    return fechaInicio >= this.minDate && fechaInicio <= this.maxDate && fechaFin >= this.minDate && fechaFin <= this.maxDate;
  }

  private crearFiltros(incluirPaginado: boolean): ReporteAsignacionFiltro {
    const value = this.form.value;
    const filtros: ReporteAsignacionFiltro = {
      idConvocatoria: value.idConvocatoria ?? null,
      cveOoad: value.cveOoad ?? null,
      cveZona: value.cveZona ?? null,
      idTipoAsignacion: value.idTipoAsignacion ?? null,
      cveEspecialidad: value.cveEspecialidad ?? null,
      numPlaza: value.numPlaza?.trim() || null,
      matriculaFolio: value.matriculaFolio?.trim() || null,
      fechaInicio: this.formatearFecha(value.fechaInicio),
      fechaFin: this.formatearFecha(value.fechaFin),
    };

    if (incluirPaginado) {
      filtros.page = this.paginaActual;
      filtros.size = this.rows;
    }

    return filtros;
  }

  private exportarReporte(tipo: 'general' | 'detalle'): void {
    if (!this.validarBusqueda()) return;

    const exportando = tipo === 'general' ? this.exportandoGeneral : this.exportandoDetalle;
    const servicio = tipo === 'general'
      ? this.reporteAsignacionService.exportarReporteGeneral(this.crearFiltros(false))
      : this.reporteAsignacionService.exportarReporteDetalle(this.crearFiltros(false));

    exportando.set(true);

    servicio.pipe(
      takeUntil(this.destroy$),
      finalize(() => exportando.set(false))
    ).subscribe({
      next: (archivo) => {
        const sufijo = tipo === 'general' ? 'GENERAL' : 'DETALLE';
        saveAs(archivo, `REPORTE_ASIGNACION_${sufijo}_${this.obtenerMarcaTiempo()}.xlsx`);
      },
      error: (error) => {
        console.error('Error al descargar el Excel:', error);
        this.alertaService.error('Error al descargar el Excel');
      },
    });
  }

  private mapearOpciones(items: unknown[], labelKeys: string[], valueKeys: string[]): TipoDropdown[] {
    const opciones = items
      .map((item) => ({
        label: String(this.obtenerPropiedad(item, labelKeys) ?? ''),
        value: this.obtenerPropiedad(item, valueKeys),
      }))
      .filter((item) => item.label && item.value !== null && item.value !== undefined);

    return [...opciones];
  }

  private obtenerPropiedad(item: unknown, keys: string[]): unknown {
    if (!item || typeof item !== 'object') return null;

    const registro = item as Record<string, unknown>;
    return keys.map((key) => registro[key]).find((value) => value !== null && value !== undefined && value !== '');
  }

  private obtenerValor(...valores: unknown[]): string {
    const valor = valores.find((item) => item !== null && item !== undefined && item !== '');
    return valor !== undefined ? String(valor) : '-';
  }

  private crearFecha(value: unknown): Date | null {
    if (!value) return null;

    if (value instanceof Date) {
      return this.limpiarHora(value);
    }

    const texto = String(value).trim();
    const matchIso = /^(\d{4})-(\d{2})-(\d{2})/.exec(texto);
    const matchMx = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(texto);

    if (matchIso) {
      return this.crearFechaDesdePartes(Number(matchIso[1]), Number(matchIso[2]), Number(matchIso[3]));
    }

    if (matchMx) {
      return this.crearFechaDesdePartes(Number(matchMx[3]), Number(matchMx[2]), Number(matchMx[1]));
    }

    const fecha = new Date(texto);
    return Number.isNaN(fecha.getTime()) ? null : this.limpiarHora(fecha);
  }

  private crearFechaDesdePartes(year: number, month: number, day: number): Date | null {
    const fecha = new Date(year, month - 1, day);

    if (fecha.getFullYear() !== year || fecha.getMonth() !== month - 1 || fecha.getDate() !== day) {
      return null;
    }

    return this.limpiarHora(fecha);
  }

  private limpiarHora(fecha: Date): Date {
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setHours(0, 0, 0, 0);
    return nuevaFecha;
  }

  private formatearFecha(fecha: unknown): string | null {
    const fechaValida = this.crearFecha(fecha);
    if (!fechaValida) return null;

    return `${fechaValida.getFullYear()}-${this.rellenarDosDigitos(fechaValida.getMonth() + 1)}-${this.rellenarDosDigitos(fechaValida.getDate())}`;
  }

  private obtenerMarcaTiempo(): string {
    const fecha = new Date();
    const year = fecha.getFullYear();
    const month = this.rellenarDosDigitos(fecha.getMonth() + 1);
    const day = this.rellenarDosDigitos(fecha.getDate());
    const hours = this.rellenarDosDigitos(fecha.getHours());
    const minutes = this.rellenarDosDigitos(fecha.getMinutes());

    return `${year}${month}${day}_${hours}${minutes}`;
  }

  private rellenarDosDigitos(value: number): string {
    return String(value).padStart(2, '0');
  }

  private normalizarTexto(value: string): string {
    return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  private obtenerMensajeError(error: unknown): string {
    const detalle = error as { error?: { mensaje?: string }, message?: string };
    return detalle?.error?.mensaje || detalle?.message || this.mensajes.MSG082;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}