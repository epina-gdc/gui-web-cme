import {CommonModule} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {GeneralComponent} from '@components/general.component';
import {
  CatPerfil,
  CatPerfilResponse,
  CatSubperfil,
  CatSubperfilResponse,
  CatTipoConvocatoria,
  CatTipoConvocatoriaResponse
} from '@models/catalogoGeneral';
import {
  Convocatoria,
  ConvocatoriaDetalle,
  ConvocatoriaPerfil,
  ConvocatoriaRegistroRequest,
  ConvocatoriaSubperfil
} from '@models/convocatoria.interface';
import {HttpRespuesta} from '@models/http-respuesta.interface';
import {TipoDropdown} from '@models/tipo-dropdown.interface';
import {forkJoin, of} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import {Button} from 'primeng/button';
import {DatePickerModule} from 'primeng/datepicker';
import {InputTextModule} from 'primeng/inputtext';
import {MultiSelectModule} from 'primeng/multiselect';
import {Select} from 'primeng/select';

interface SubperfilDropdown extends TipoDropdown {
  value: number;
  idPerfil?: number;
}

@Component({
  selector: 'app-configuracion-registro',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Button,
    DatePickerModule,
    InputTextModule,
    MultiSelectModule,
    Select,
  ],
  templateUrl: './configuracion-registro.component.html',
  styleUrl: './configuracion-registro.component.scss'
})
export class ConfiguracionRegistroComponent extends GeneralComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly ESTATUS_ACTIVO = 1;

  formConfiguracion!: FormGroup;
  optionsConvocatorias: TipoDropdown[] = [];
  optionsTiposConvocatoria: TipoDropdown[] = [];
  optionsPerfiles: TipoDropdown[] = [];
  optionsSubperfiles: SubperfilDropdown[] = [];

  isLoadingCatalogos = false;
  isLoadingDetalle = false;
  isLoadingSubperfiles = false;
  isSaving = false;
  modoAltaNuevaConvocatoria = false;

  private lstConvocatorias: Convocatoria[] = [];
  private selectedConvocatoriaId: number | null = null;
  private subperfilesPorPerfil = new Map<number, SubperfilDropdown[]>();

  ngOnInit(): void {
    this.formConfiguracion = this.inicializarForm();
    this.inicializarCambios();
    this.obtenerCatalogos();
  }

  get esEdicion(): boolean {
    return this.selectedConvocatoriaId !== null;
  }

  get guardarDeshabilitado(): boolean {
    return this.formConfiguracion.invalid || this.isSaving || this.isLoadingDetalle;
  }

  get mensajeCampoRequerido(): string {
    return this._Mensajes.MSJ_CAMPO_REQUERIDO;
  }

  inicializarForm(): FormGroup {
    return this.fb.group({
      convocatoria: [null],
      idTipoConvocatoria: [null, Validators.required],
      desConvocatoria: ['', [Validators.required, Validators.maxLength(200)]],
      fecInicioEvento: [null, Validators.required],
      horaInicioEvento: [null, Validators.required],
      fecFinEvento: [null, Validators.required],
      horaFinEvento: [null, Validators.required],
      fechaInicioRegistro: [null],
      horaInicioRegistro: [null],
      fechaFinRegistro: [null],
      horaFinRegistro: [null],
      perfiles: [[]],
      subperfiles: [[]],
      refUrlTableroOferta: [null],
      indHabilitaRegistro: [this.ESTATUS_ACTIVO],
      indPermisoSustitucion: [this.ESTATUS_ACTIVO],
    }, {validators: this.validarRangosFechas()});
  }

  inicializarCambios(): void {
    this.formConfiguracion.controls['convocatoria'].valueChanges.subscribe(value => {
      const idConvocatoria = Number(value);
      if (this.modoAltaNuevaConvocatoria && !idConvocatoria) {
        return;
      }
      if (idConvocatoria) {
        this.obtenerDetalleConvocatoria(idConvocatoria);
        return;
      }
      this.modoAltaNuevaConvocatoria = false;
      this.formConfiguracion.controls['convocatoria'].enable({emitEvent: false});
      this.reiniciarFormulario(false);
    });

    this.formConfiguracion.controls['perfiles'].valueChanges.subscribe(value => {
      this.onPerfilesChange(this.normalizarIds(value));
    });
  }

  obtenerCatalogos(): void {
    this.isLoadingCatalogos = true;
    forkJoin([
      this._CatalogoGenService.getLsConvocatorias(),
      this._CatalogoGenService.getLstPerfil(),
      this._CatalogoGenService.getLstTiposConvocatoria().pipe(
        catchError(error => {
          return of({
            exito: false,
            mensaje: error?.error?.mensaje ?? error?.mensaje ?? '',
            respuesta: []
          } as CatTipoConvocatoriaResponse);
        })
      )
    ])
      .pipe(finalize(() => this.isLoadingCatalogos = false))
      .subscribe({
        next: ([convocatorias, perfiles, tiposConvocatoria]: [HttpRespuesta<Convocatoria[]>, CatPerfilResponse, CatTipoConvocatoriaResponse]) => {
          this.lstConvocatorias = convocatorias.respuesta ?? [];
          this.optionsConvocatorias = this.convocatoriasToTipoDropdown(this.lstConvocatorias);
          this.optionsTiposConvocatoria = this.tiposConvocatoriaToTipoDropdown(tiposConvocatoria.respuesta ?? []);
          this.optionsPerfiles = this.perfilesToTipoDropdown(perfiles.respuesta ?? []);

          if (!tiposConvocatoria.exito) {
            this._alertServices.error(tiposConvocatoria.mensaje || 'No fue posible cargar el cat\u00e1logo de tipos de convocatoria.');
          }
        },
        error: () => {
          this._alertServices.error('No fue posible cargar los cat\u00e1logos de configuraci\u00f3n.');
        }
      });
  }

  obtenerDetalleConvocatoria(idConvocatoria: number): void {
    this.isLoadingDetalle = true;
    this.selectedConvocatoriaId = idConvocatoria;
    this._ConvocatoriaService.consultarDetalleConvocatoria(idConvocatoria)
      .pipe(finalize(() => this.isLoadingDetalle = false))
      .subscribe({
        next: (response: HttpRespuesta<ConvocatoriaDetalle>) => {
          if (!response.exito) {
            this._alertServices.error(response.mensaje);
            return;
          }
          this.cargarDetalle(response.respuesta);
        },
        error: () => {
          this._alertServices.error('No fue posible consultar la convocatoria seleccionada.');
        }
      });
  }

  nuevaConvocatoria(emitEvent: boolean = true): void {
    this.modoAltaNuevaConvocatoria = true;
    this.reiniciarFormulario(emitEvent);
    this.formConfiguracion.controls['convocatoria'].disable({emitEvent: false});
  }

  limpiar(): void {
    this.modoAltaNuevaConvocatoria = false;
    this.formConfiguracion.controls['convocatoria'].enable({emitEvent: false});
    this.reiniciarFormulario(false);
  }

  private reiniciarFormulario(emitEvent: boolean = true): void {
    this.selectedConvocatoriaId = null;
    this.optionsSubperfiles = [];
    this.formConfiguracion.reset({
      convocatoria: null,
      idTipoConvocatoria: null,
      desConvocatoria: '',
      fecInicioEvento: null,
      horaInicioEvento: null,//this.crearHora(0, 0),
      fecFinEvento: null,
      horaFinEvento: null,//this.crearHora(23, 59),
      fechaInicioRegistro: null,
      horaInicioRegistro: null,
      fechaFinRegistro: null,
      horaFinRegistro: null,
      perfiles: [],
      subperfiles: [],
      refUrlTableroOferta: null,
      indHabilitaRegistro: this.ESTATUS_ACTIVO,
      indPermisoSustitucion: this.ESTATUS_ACTIVO,
    }, {emitEvent});
    this.formConfiguracion.markAsPristine();
    this.formConfiguracion.markAsUntouched();
  }

  guardar(): void {
    if (this.formConfiguracion.invalid) {
      this.formConfiguracion.markAllAsTouched();
      return;
    }

    const request = this.construirRequest();
    const guardado$ = this.esEdicion && this.selectedConvocatoriaId
      ? this._ConvocatoriaService.actualizarConvocatoria(this.selectedConvocatoriaId, request)
      : this._ConvocatoriaService.guardarConvocatoria(request);

    this.isSaving = true;
    guardado$
      .pipe(finalize(() => this.isSaving = false))
      .subscribe({
        next: (response: HttpRespuesta<ConvocatoriaDetalle>) => {
          if (!response.exito) {
            this._alertServices.error(response.mensaje);
            return;
          }
          this._alertServices.exito('Se guard\u00f3 con \u00e9xito la convocatoria.');
          this.sincronizarConvocatoriaGuardada(response.respuesta);
          this.cargarDetalle(response.respuesta);
        },
        error: () => {
          this._alertServices.error('No fue posible guardar la configuraci\u00f3n, por favor intente nuevamente.');
        }
      });
  }

  esInvalido(controlName: string): boolean {
    const control = this.formConfiguracion.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  mostrarErrorRango(tipo: 'evento' | 'registro'): boolean {
    const errorName = tipo === 'evento' ? 'eventoRangoInvalido' : 'registroRangoInvalido';
    return !!this.formConfiguracion.errors?.[errorName] && (this.formConfiguracion.dirty || this.formConfiguracion.touched);
  }

  private cargarDetalle(detalle: ConvocatoriaDetalle): void {
    this.modoAltaNuevaConvocatoria = false;
    this.formConfiguracion.controls['convocatoria'].enable({emitEvent: false});
    this.selectedConvocatoriaId = detalle.idConvocatoria ?? this.selectedConvocatoriaId;
    this.agregarPerfilesSeleccionados(detalle.perfiles ?? []);

    const perfilesSeleccionados = (detalle.perfiles ?? []).map(perfil => perfil.idPerfil);
    const subperfilesSeleccionados = (detalle.subperfiles ?? []).map(subperfil => subperfil.idSubperfil);

    this.formConfiguracion.patchValue({
      convocatoria: this.selectedConvocatoriaId,
      idTipoConvocatoria: detalle.idTipoConvocatoria ?? detalle.tipoConvocatoria?.idTipoConvocatoria ?? null,
      desConvocatoria: detalle.desConvocatoria ?? '',
      fecInicioEvento: this.parseFecha(detalle.fecInicio),
      horaInicioEvento: this.parseHora(detalle.fecInicio, this.crearHora(0, 0)),
      fecFinEvento: this.parseFecha(detalle.fecFin),
      horaFinEvento: this.parseHora(detalle.fecFin, this.crearHora(23, 59)),
      fechaInicioRegistro: this.parseFecha(detalle.fechaInicioRegistro),
      horaInicioRegistro: this.parseHora(detalle.fechaInicioRegistro),
      fechaFinRegistro: this.parseFecha(detalle.fechaFinRegistro),
      horaFinRegistro: this.parseHora(detalle.fechaFinRegistro),
      perfiles: perfilesSeleccionados,
      subperfiles: [],
      refUrlTableroOferta: detalle.refUrlTableroOferta ?? null,
      indHabilitaRegistro: detalle.indHabilitaRegistro ?? this.ESTATUS_ACTIVO,
      indPermisoSustitucion: detalle.indPermisoSustitucion ?? this.ESTATUS_ACTIVO,
    }, {emitEvent: false});

    this.cargarSubperfilesPorPerfiles(perfilesSeleccionados, detalle.subperfiles ?? [], () => {
      this.formConfiguracion.controls['subperfiles'].setValue(subperfilesSeleccionados, {emitEvent: false});
      this.formConfiguracion.updateValueAndValidity();
      this.formConfiguracion.markAsPristine();
      this.formConfiguracion.markAsUntouched();
    });
  }

  private onPerfilesChange(idPerfiles: number[]): void {
    this.limpiarSubperfilesSinPerfil(idPerfiles);
    this.cargarSubperfilesPorPerfiles(idPerfiles);
  }

  private cargarSubperfilesPorPerfiles(
    idPerfiles: number[],
    subperfilesSeleccionados: ConvocatoriaSubperfil[] = [],
    onComplete?: () => void
  ): void {
    if (idPerfiles.length === 0) {
      this.optionsSubperfiles = this.subperfilesDetalleToDropdown(subperfilesSeleccionados);
      if (subperfilesSeleccionados.length === 0) {
        this.formConfiguracion.controls['subperfiles'].setValue([], {emitEvent: false});
      }
      if (onComplete) {
        onComplete();
      }
      return;
    }

    const perfilesPendientes = idPerfiles.filter(idPerfil => !this.subperfilesPorPerfil.has(idPerfil));

    if (perfilesPendientes.length === 0) {
      this.actualizarOptionsSubperfiles(idPerfiles, subperfilesSeleccionados);
      if (onComplete) {
        onComplete();
      }
      return;
    }

    this.isLoadingSubperfiles = true;
    forkJoin(perfilesPendientes.map(idPerfil =>
      this._CatalogoGenService.getLstSubPerfil(idPerfil).pipe(
        map((response: CatSubperfilResponse) => ({
          idPerfil,
          subperfiles: this.subperfilesToDropdown(response.respuesta ?? [], idPerfil)
        })),
        catchError(() => of({idPerfil, subperfiles: [] as SubperfilDropdown[]}))
      )
    ))
      .pipe(finalize(() => this.isLoadingSubperfiles = false))
      .subscribe(results => {
        results.forEach(result => this.subperfilesPorPerfil.set(result.idPerfil, result.subperfiles));
        this.actualizarOptionsSubperfiles(idPerfiles, subperfilesSeleccionados);
        if (onComplete) {
          onComplete();
        }
      });
  }

  private actualizarOptionsSubperfiles(idPerfiles: number[], subperfilesSeleccionados: ConvocatoriaSubperfil[] = []): void {
    const subperfilesCatalogo = idPerfiles.flatMap(idPerfil => this.subperfilesPorPerfil.get(idPerfil) ?? []);
    this.optionsSubperfiles = this.mergeTipoDropdown(
      subperfilesCatalogo,
      this.subperfilesDetalleToDropdown(subperfilesSeleccionados)
    ) as SubperfilDropdown[];
    this.limpiarSubperfilesSinPerfil(idPerfiles);
  }

  private limpiarSubperfilesSinPerfil(idPerfiles: number[]): void {
    const idsPermitidos = new Set(
      this.optionsSubperfiles
        .filter(option => !option.idPerfil || idPerfiles.includes(option.idPerfil))
        .map(option => option.value)
    );

    const subperfilesSeleccionados = this.normalizarIds(this.formConfiguracion.controls['subperfiles'].value)
      .filter(idSubperfil => idsPermitidos.has(idSubperfil));

    this.formConfiguracion.controls['subperfiles'].setValue(subperfilesSeleccionados, {emitEvent: false});
  }

  private construirRequest(): ConvocatoriaRegistroRequest {
    const value = this.formConfiguracion.getRawValue();
    const fechaInicio = this.crearFechaHora(value.fecInicioEvento, value.horaInicioEvento);
    const fechaFin = this.crearFechaHora(value.fecFinEvento, value.horaFinEvento);
    const fechaInicioRegistro = this.crearFechaHora(value.fechaInicioRegistro, value.horaInicioRegistro);
    const fechaFinRegistro = this.crearFechaHora(value.fechaFinRegistro, value.horaFinRegistro);

    return {
      desConvocatoria: value.desConvocatoria,
      fecInicio: fechaInicio!,//this.formatearFecha(value.fecInicioEvento),
      fecFin: fechaFin!,//this.formatearFecha(value.fecFinEvento),
      idTipoConvocatoria: Number(value.idTipoConvocatoria),
      refUrlTableroOferta: value.refUrlTableroOferta ?? null,
      indHabilitaRegistro: Number(value.indHabilitaRegistro ?? this.ESTATUS_ACTIVO),
      indPermisoSustitucion: Number(value.indPermisoSustitucion ?? this.ESTATUS_ACTIVO),
      fechaInicioRegistro,
      fechaFinRegistro,
      perfiles: this.normalizarIds(value.perfiles).map(idPerfil => ({idPerfil})),
      subperfiles: this.normalizarIds(value.subperfiles).map(idSubperfil => ({idSubperfil})),
    };
  }

  private validarRangosFechas(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const form = control as FormGroup;
      const errores: ValidationErrors = {};
      const inicioEvento = this.obtenerFechaHora(form.get('fecInicioEvento')?.value, form.get('horaInicioEvento')?.value);
      const finEvento = this.obtenerFechaHora(form.get('fecFinEvento')?.value, form.get('horaFinEvento')?.value);
      const inicioRegistro = this.obtenerFechaHora(form.get('fechaInicioRegistro')?.value, form.get('horaInicioRegistro')?.value);
      const finRegistro = this.obtenerFechaHora(form.get('fechaFinRegistro')?.value, form.get('horaFinRegistro')?.value);

      if (inicioEvento && finEvento && inicioEvento.getTime() > finEvento.getTime()) {
        errores['eventoRangoInvalido'] = true;
      }

      if (inicioRegistro && finRegistro && inicioRegistro.getTime() > finRegistro.getTime()) {
        errores['registroRangoInvalido'] = true;
      }

      return Object.keys(errores).length > 0 ? errores : null;
    };
  }

  private convocatoriasToTipoDropdown(items: Convocatoria[]): TipoDropdown[] {
    return items.map(item => ({
      value: item.idConvocatoria,
      label: item.desConvocatoria
    }));
  }

  private tiposConvocatoriaToTipoDropdown(items: CatTipoConvocatoria[]): TipoDropdown[] {
    return items.map(item => ({
      value: item.idTipoConvocatoria,
      label: item.desTipoConvocatoria
    }));
  }

  private perfilesToTipoDropdown(items: CatPerfil[]): TipoDropdown[] {
    return items.map(item => ({
      value: item.idPerfil,
      label: item.nomPerfil ?? item.desPerfil ?? item.descripcion ?? item.clave ?? String(item.idPerfil)
    }));
  }

  private subperfilesToDropdown(items: CatSubperfil[], idPerfil: number): SubperfilDropdown[] {
    return items.map(item => ({
      value: item.idSubperfil,
      label: item.nomSubperfil ?? item.desSubperfil ?? item.descripcion ?? item.clave ?? String(item.idSubperfil),
      idPerfil
    }));
  }

  private subperfilesDetalleToDropdown(items: ConvocatoriaSubperfil[]): SubperfilDropdown[] {
    return items.map(item => ({
      value: item.idSubperfil,
      label: item.descripcion ?? item.clave ?? String(item.idSubperfil)
    }));
  }

  private agregarPerfilesSeleccionados(perfiles: ConvocatoriaPerfil[]): void {
    const seleccionados = perfiles.map(perfil => ({
      value: perfil.idPerfil,
      label: perfil.descripcion ?? perfil.clave ?? String(perfil.idPerfil)
    }));

    this.optionsPerfiles = this.mergeTipoDropdown(this.optionsPerfiles, seleccionados);
  }

  private mergeTipoDropdown(base: TipoDropdown[], adicionales: TipoDropdown[]): TipoDropdown[] {
    const mapa = new Map<unknown, TipoDropdown>();
    [...base, ...adicionales].forEach(item => {
      if (item.value !== null && item.value !== undefined && !mapa.has(item.value)) {
        mapa.set(item.value, item);
      }
    });
    return Array.from(mapa.values());
  }

  private sincronizarConvocatoriaGuardada(detalle: ConvocatoriaDetalle): void {
    if (!detalle.idConvocatoria) {
      return;
    }

    const idTipoConvocatoriaRespuesta = detalle.idTipoConvocatoria ?? detalle.tipoConvocatoria?.idTipoConvocatoria;
    const opcionTipoConvocatoria = this.optionsTiposConvocatoria.find(
      item => item.value === idTipoConvocatoriaRespuesta
    );
    const idTipoConvocatoria = idTipoConvocatoriaRespuesta
      ?? Number(opcionTipoConvocatoria?.value);
    const desTipoConvocatoria = detalle.tipoConvocatoria?.desTipoConvocatoria
      ?? opcionTipoConvocatoria?.label
      ?? '';

    const convocatoria: Convocatoria = {
      idConvocatoria: detalle.idConvocatoria,
      desConvocatoria: detalle.desConvocatoria,
      fecInicio: detalle.fecInicio,
      fecFin: detalle.fecFin,
      indActivo: detalle.indActivo ?? this.ESTATUS_ACTIVO,
      tipo: {
        idTipoConvocatoria,
        desTipoConvocatoria,
      }
    };

    const index = this.lstConvocatorias.findIndex(item => item.idConvocatoria === convocatoria.idConvocatoria);
    if (index >= 0) {
      this.lstConvocatorias[index] = convocatoria;
    } else {
      this.lstConvocatorias = [...this.lstConvocatorias, convocatoria];
    }

    this.optionsConvocatorias = this.convocatoriasToTipoDropdown(this.lstConvocatorias);
    this.selectedConvocatoriaId = detalle.idConvocatoria;
  }

  private normalizarIds(value: unknown): number[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map(item => Number(item))
      .filter(item => Number.isFinite(item));
  }

  private parseFecha(value?: string | null): Date | null {
    if (!value) {
      return null;
    }

    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) {
      return null;
    }

    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }

  private parseHora(value?: string | null, defaultValue: Date | null = null): Date | null {
    if (!value) {
      return defaultValue;
    }

    const match = value.match(/T?(\d{2}):(\d{2})(?::(\d{2}))?/);
    if (!match) {
      return defaultValue;
    }

    return this.crearHora(Number(match[1]), Number(match[2]), Number(match[3] ?? 0));
  }

  private formatearFecha(value: Date | null): string {
    if (!value) {
      return '';
    }

    return `${value.getFullYear()}-${this.pad(value.getMonth() + 1)}-${this.pad(value.getDate())}`;
  }

  private crearFechaHora(fecha: Date | null, hora: Date | null): string | null {
    if (!fecha || !hora) {
      return null;
    }

    return `${this.formatearFecha(fecha)}T${this.pad(hora.getHours())}:${this.pad(hora.getMinutes())}:${this.pad(hora.getSeconds())}`;
  }

  private obtenerFechaHora(fecha: Date | null, hora: Date | null): Date | null {
    if (!fecha || !hora) {
      return null;
    }

    return new Date(
      fecha.getFullYear(),
      fecha.getMonth(),
      fecha.getDate(),
      hora.getHours(),
      hora.getMinutes(),
      hora.getSeconds()
    );
  }

  private crearHora(hours: number, minutes: number, seconds: number = 0): Date {
    return new Date(1970, 0, 1, hours, minutes, seconds);
  }

  private pad(value: number): string {
    return value.toString().padStart(2, '0');
  }

}
