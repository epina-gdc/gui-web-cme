import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '@services/alert.service';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { GeneralComponent } from '@components/general.component';
import { HttpRespuesta } from '@models/http-respuesta.interface';
import {
  ActualizarPlazaRequest,
  AdscripcionPlaza,
  DetallePlazaResponse,
  NuevaPlazaCatalogos,
  NuevaPlazaService,
  RegistrarPlazaRequest
} from '@services/nueva-plaza.service';
import { of } from 'rxjs';
import { catchError, distinctUntilChanged, finalize, map, switchMap, tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface CatalogoOption {
  label: string;
  value: string | number;
}

interface ZonaCatalogo {
  desZona?: string;
  cveZona?: string | number;
}

type CatalogosNuevaPlazaRoute = NuevaPlazaCatalogos;

@Component({
  selector: 'app-nueva-plaza',
  imports: [
    Button,
    CommonModule,
    InputText,
    ReactiveFormsModule,
    Select,
    TextareaModule
  ],
  templateUrl: './nueva-plaza.component.html',
  styleUrl: './nueva-plaza.component.scss'
})
export class NuevaPlazaComponent extends GeneralComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly alertService = inject(AlertService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly nuevaPlazaService = inject(NuevaPlazaService);

  private consecutivo = 1;
  private plazaEdicion: DetallePlazaResponse | null = null;
  private zonaEdicionPendiente: { value?: unknown; descripcion?: unknown } | null = null;

  readonly maxObservaciones = 500;

  readonly form = this.fb.nonNullable.group({
    ooad: ['', Validators.required],
    numeroPlaza: [''],
    tipoUnidad: ['', Validators.required],
    categoria: ['', Validators.required],
    especialidad: ['', Validators.required],
    horario: ['', Validators.required],
    turno: ['', Validators.required],
    zona: ['', Validators.required],
    marcaOcupacion: ['', Validators.required],
    clasificacionUnidad: ['', Validators.required],
    unidad: ['', Validators.required],
    adscripcion: ['', Validators.required],
    tipoPlaza: ['', Validators.required],
    estatus: ['', Validators.required],
    observaciones: ['', [Validators.required, Validators.maxLength(this.maxObservaciones)]]
  });

  ooads: CatalogoOption[] = [];
  tiposUnidad: CatalogoOption[] = [];
  categorias: CatalogoOption[] = [];
  especialidades: CatalogoOption[] = [];
  horarios: CatalogoOption[] = [];
  turnos: CatalogoOption[] = [];
  marcasOcupacion: CatalogoOption[] = [];
  clasificacionesUnidad: CatalogoOption[] = [];
  unidades: CatalogoOption[] = [];
  adscripciones: CatalogoOption[] = [];
  tiposPlaza: CatalogoOption[] = [];
  puestos: CatalogoOption[] = [];
  estatus: CatalogoOption[] = [];
  zonas: CatalogoOption[] = [];

  guardando = false;
  modoEdicion = false;

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.inicializarCascadaZonas();

    this.activatedRoute.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ catalogos }) => {
        this.cargarCatalogos(catalogos as CatalogosNuevaPlazaRoute | undefined);
        this.cargarPlazaEdicionDesdeRuta();
      });
  }

  ngOnDestroy(): void {
    console.log('Destroy');
  }

  get tituloFormulario(): string {
    return this.modoEdicion ? 'Editar plaza' : 'Nueva plaza';
  }

  get labelGuardar(): string {
    return this.modoEdicion ? 'Actualizar' : 'Guardar';
  }

  get editar(): boolean {
    return this.modoEdicion;
  }

  get guardarDeshabilitado(): boolean {
    return this.form.invalid
      || this.guardando
      || (this.modoEdicion && this.form.pristine)
      || (this.modoEdicion && this.obtenerNumeroSolicitud(this.form.controls.numeroPlaza.value) === undefined);
  }

  get caracteresObservaciones(): number {
    return this.form.controls.observaciones.value.length;
  }

  limpiar(): void {
    if (this.modoEdicion && this.plazaEdicion) {
      this.cargarFormularioEdicion(this.plazaEdicion);
      return;
    }

    this.form.reset({
      ooad: '',
      numeroPlaza: '',
      tipoUnidad: '',
      categoria: '',
      especialidad: '',
      horario: '',
      turno: '',
      zona: '',
      marcaOcupacion: '',
      clasificacionUnidad: '',
      unidad: '',
      adscripcion: '',
      tipoPlaza: '',
      estatus: '',
      observaciones: ''
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  guardar(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid || this.guardando || (this.modoEdicion && this.form.pristine)) {
      return;
    }

    if (!this.validarNumeroPlazaEdicion()) {
      return;
    }

    this.guardando = true;

    const operacionGuardar = this.modoEdicion
      ? this.nuevaPlazaService.actualizarPlaza(this.crearSolicitudActualizarPlaza())
      : this.nuevaPlazaService.registrarPlaza(this.crearSolicitudRegistrarPlaza());

    operacionGuardar.pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => {
        this.guardando = false;
      })
    ).subscribe({
      next: (response) => {
        if (!response.exito) {
          this.alertService.alerta(response.mensaje || 'No fue posible guardar la plaza.');
          return;
        }

        this.consecutivo++;
        this.alertService.exito(response.mensaje || this.obtenerMensajeExito());
        this.limpiar();

        setTimeout(() => {
          this.router.navigate(['/privado/nueva-plaza']);
        }, 2000);
      },
      error: (error) => {
        this.alertService.error(error?.error?.mensaje || this.obtenerMensajeError());
      }
    });
  }

  private cargarCatalogos(catalogos?: CatalogosNuevaPlazaRoute): void {
    if (!catalogos) {
      return;
    }

    this.ooads = this.mapearCatalogo(catalogos.ooads.respuesta, 'desOoad', 'cveOoad');
    this.especialidades = this.mapearCatalogo(catalogos.especialidades, 'desEspecialidad', 'cveEspecialidad');
    this.tiposUnidad = this.mapearCatalogo(catalogos.tiposUnidad.respuesta, 'descTipoUnidad', 'cveTipoUnidad');
    this.categorias = this.mapearCatalogo(catalogos.categorias.respuesta, 'descCategoria', 'cveCategoria');
    this.horarios = this.mapearCatalogo(catalogos.horarios.respuesta, 'descHorario', 'cveHorario');
    this.turnos = this.mapearCatalogo(catalogos.turnos.respuesta, 'descTurno', 'cveTurno');
    this.marcasOcupacion = this.mapearCatalogo(catalogos.marcasOcupacion.respuesta, 'descMarcaOcupacion', 'cveMarcaOcupacion');
    this.clasificacionesUnidad = this.mapearCatalogo(catalogos.clasificacionesUnidad.respuesta, 'descClasificacionUnidad', 'cveClasificacionUnidad');
    this.unidades = this.mapearCatalogo(catalogos.unidades.respuesta, 'descUnidad', 'cveUnidad');
    this.adscripciones = this.mapearAdscripciones(catalogos.adscripciones.respuesta);
    this.tiposPlaza = this.mapearCatalogo(catalogos.tiposPlaza.respuesta, 'descTipoPlaza', 'cveTipoPlaza');
    this.puestos = this.mapearCatalogo(catalogos.puestos.respuesta, 'descPuesto', 'cvePuesto');
    this.estatus = this.mapearCatalogo(
      catalogos.statusPlaza.respuesta.filter((item) => item.descEstatusPlaza.toUpperCase() !== 'OCUPADA'),
      'descEstatusPlaza',
      'idEstatusPlaza'
    );
  }

  private cargarPlazaEdicionDesdeRuta(): void {
    const idPlaza = this.obtenerIdPlazaEdicion();

    if (!idPlaza) {
      return;
    }

    this.modoEdicion = true;

    const plazaState = this.obtenerPlazaDesdeEstadoNavegacion();

    if (plazaState && Number(plazaState.idPlaza) === idPlaza) {
      this.cargarFormularioEdicion(plazaState);
    }

    this.nuevaPlazaService.buscarDetallePlaza(idPlaza)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (!response.exito || !response.respuesta) {
            this.alertService.alerta(response.mensaje || 'No fue posible consultar la plaza.');
            this.router.navigate(['/privado/nueva-plaza']);
            return;
          }

          this.cargarFormularioEdicion(response.respuesta);
        },
        error: (error) => {
          this.alertService.error(error?.error?.mensaje || 'Ocurrio un error al consultar la plaza.');
          this.router.navigate(['/privado/nueva-plaza']);
        }
      });
  }

  private cargarFormularioEdicion(plaza: DetallePlazaResponse): void {
    this.plazaEdicion = plaza;
    const valoresFormulario = this.obtenerValoresFormularioEdicion(plaza);
    const { zona: _zona, ...valoresSinZona } = valoresFormulario;
    const valorZona = this.obtenerCampo(plaza, 'cveZona');
    const descripcionZona = this.obtenerTextoCampo(plaza, 'descZona', 'zona');

    this.zonaEdicionPendiente = valorZona || descripcionZona
      ? { value: valorZona, descripcion: descripcionZona }
      : null;
    this.form.patchValue(valoresSinZona as any);
    this.aplicarZonaEdicionPendiente();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  private obtenerValoresFormularioEdicion(plaza: DetallePlazaResponse): Record<string, string | number> {
    return {
      ooad: this.obtenerValorOpcion(this.ooads, this.obtenerCampo(plaza, 'cveOoad'), this.obtenerTextoCampo(plaza, 'descOoad', 'ooad', 'ubicacion')),
      numeroPlaza: this.normalizarValor(this.obtenerCampo(plaza, 'numPlaza')),
      tipoUnidad: this.obtenerTipoUnidadEdicion(plaza),
      categoria: this.obtenerValorOpcion(this.categorias, this.obtenerCampo(plaza, 'cveCategoria'), this.obtenerTextoCampo(plaza, 'descCategoria', 'categoria')),
      especialidad: this.obtenerValorOpcion(this.especialidades, this.obtenerCampo(plaza, 'cveAreaResponsabilidad', 'cveEspecialidad'), this.obtenerTextoCampo(plaza, 'descAreaResponsabilidad', 'desEspecialidad', 'especialidad')),
      horario: this.obtenerValorOpcion(this.horarios, this.obtenerCampo(plaza, 'cveHorario'), this.obtenerTextoCampo(plaza, 'descHorario', 'horario')),
      turno: this.obtenerValorOpcion(this.turnos, this.obtenerCampo(plaza, 'cveTurno'), this.obtenerTextoCampo(plaza, 'descTurno', 'turno')),
      zona: this.obtenerValorOpcion(this.zonas, this.obtenerCampo(plaza, 'cveZona'), this.obtenerTextoCampo(plaza, 'descZona', 'zona')),
      marcaOcupacion: this.obtenerValorOpcion(this.marcasOcupacion, this.obtenerCampo(plaza, 'cveMarcaOcupacion'), this.obtenerTextoCampo(plaza, 'descMarcaOcupacion', 'marcaOcupacion')),
      clasificacionUnidad: this.obtenerValorOpcion(this.clasificacionesUnidad, this.obtenerCampo(plaza, 'cveClasificacionUnidad'), this.obtenerTextoCampo(plaza, 'descClasificacionUnidad', 'clasificacion')),
      unidad: this.obtenerValorOpcion(this.unidades, this.obtenerCampo(plaza, 'cveUnidad'), this.obtenerTextoCampo(plaza, 'descUnidad', 'umf')),
      adscripcion: this.obtenerAdscripcionEdicion(plaza),
      tipoPlaza: this.obtenerValorOpcion(this.tiposPlaza, this.obtenerCampo(plaza, 'cveTipoPlaza'), this.obtenerTextoCampo(plaza, 'descTipoPlaza', 'tipoPlaza')),
      estatus: this.obtenerValorOpcion(this.estatus, this.obtenerCampo(plaza, 'idEstatusPlaza'), this.obtenerTextoCampo(plaza, 'estatusPlaza')),
      observaciones: this.obtenerTextoCampo(plaza, 'desObservaciones', 'observaciones') ?? ''
    };
  }

  private obtenerTipoUnidadEdicion(plaza: DetallePlazaResponse): string | number {
    return this.obtenerValorOpcion(
      this.tiposUnidad,
      this.obtenerCampo(plaza, 'cveTipoUnidad'),
      this.obtenerTextoCampo(plaza, 'descTipoUnidad', 'descRegimen', 'regimen')
    );
  }

  private obtenerAdscripcionEdicion(plaza: DetallePlazaResponse): string | number {
    const descripcion = this.obtenerTextoCampo(
      plaza,
      'descDepartamento',
      'desDepartamento',
      'descAdscripcion',
      'desAdscripcion',
      'adscripcion'
    );
    const valores = [
      this.obtenerCampo(plaza, 'cveUnidad'),
      this.obtenerCampo(plaza, 'cveDepartamento'),
      this.obtenerCampo(plaza, 'cveAdscripcion')
    ];

    for (const valor of valores) {
      const opcion = this.obtenerValorOpcion(this.adscripciones, valor, descripcion);

      if (opcion !== '' && this.buscarOpcion(this.adscripciones, opcion)) {
        return opcion;
      }
    }

    return this.obtenerValorOpcion(this.adscripciones, valores.find(valor => valor !== undefined), descripcion);
  }

  private crearSolicitudRegistrarPlaza(): RegistrarPlazaRequest {
    const valores = this.form.getRawValue();
    const ooad = this.buscarOpcion(this.ooads, valores.ooad);
    const zona = this.buscarOpcion(this.zonas, valores.zona);
    const clasificacionUnidad = this.buscarOpcion(this.clasificacionesUnidad, valores.clasificacionUnidad);
    const unidad = this.buscarOpcion(this.unidades, valores.unidad);
    const adscripcion = this.buscarOpcion(this.adscripciones, valores.adscripcion);
    const categoria = this.buscarOpcion(this.categorias, valores.categoria);
    const especialidad = this.buscarOpcion(this.especialidades, valores.especialidad);
    const turno = this.buscarOpcion(this.turnos, valores.turno);
    const horario = this.buscarOpcion(this.horarios, valores.horario);
    const tipoPlaza = this.buscarOpcion(this.tiposPlaza, valores.tipoPlaza);
    const marcaOcupacion = this.buscarOpcion(this.marcasOcupacion, valores.marcaOcupacion);
    const solicitud: RegistrarPlazaRequest = {
      ...this.obtenerCamposComplementariosPlaza(),
      cveOoad: valores.ooad,
      descOoad: ooad?.label,
      cveZona: this.obtenerValorSolicitud(valores.zona),
      descZona: zona?.label,
      descRegimen: this.obtenerValorSolicitud(valores.tipoUnidad),
      clasificacion: clasificacionUnidad?.label,
      cveUnidad: this.obtenerTextoSolicitud(valores.unidad),
      descUnidad: unidad?.label,
      cveDepartamento: this.obtenerTextoSolicitud(valores.adscripcion),
      descDepartamento: adscripcion?.label,
      cveCategoria: this.obtenerTextoSolicitud(valores.categoria),
      descCategoria: categoria?.label,
      cveAreaResponsabilidad: this.obtenerTextoSolicitud(valores.especialidad),
      descAreaResponsabilidad: especialidad?.label,
      cveTurno: this.obtenerNumeroSolicitud(valores.turno),
      descTurno: turno?.label,
      cveHorario: this.obtenerTextoSolicitud(valores.horario),
      descHorario: horario?.label,
      cveTipoPlaza: this.obtenerTextoSolicitud(valores.tipoPlaza),
      descTipoPlaza: tipoPlaza?.label,
      cveMarcaOcupacion: this.obtenerNumeroSolicitud(valores.marcaOcupacion),
      descMarcaOcupacion: marcaOcupacion?.label,
      idEstatusPlaza: this.obtenerNumeroSolicitud(valores.estatus) ?? 0,
      origenPlaza: 'MANUAL',
      desObservaciones: valores.observaciones
    };
    const numPlaza = this.obtenerNumeroSolicitud(valores.numeroPlaza);

    if (numPlaza !== undefined) {
      solicitud.numPlaza = numPlaza;
    }

    return solicitud;
  }

  private crearSolicitudActualizarPlaza(): ActualizarPlazaRequest {
    if (!this.plazaEdicion?.idPlaza) {
      throw new Error('No se encontro la plaza a actualizar.');
    }

    const solicitud = this.crearSolicitudRegistrarPlaza();
    const numPlaza = this.obtenerNumeroSolicitud(this.form.controls.numeroPlaza.value) as number;

    return {
      ...solicitud,
      idPlaza: Number(this.plazaEdicion.idPlaza),
      numPlaza,
    };
  }

  private obtenerCamposComplementariosPlaza(): Partial<RegistrarPlazaRequest> {
    if (!this.plazaEdicion) {
      return {};
    }

    return {
      cvePuesto: this.obtenerTextoCampo(this.plazaEdicion, 'cvePuesto'),
      descPuesto: this.obtenerTextoCampo(this.plazaEdicion, 'descPuesto', 'puesto'),
      descRegimen: this.obtenerTextoCampo(this.plazaEdicion, 'descRegimen', 'regimen'),
      refDireccionUnidad: this.obtenerTextoCampo(this.plazaEdicion, 'refDireccionUnidad', 'direccion'),
      indHospitalNuevo: this.obtenerNumeroCampo(this.plazaEdicion, 'indHospitalNuevo', 'nuevoHospital'),
      refSueldoMensualBruto: this.obtenerNumeroCampo(this.plazaEdicion, 'refSueldoMensualBruto', 'sueldoMensualBruto'),
      refSueldoMensualNeto: this.obtenerNumeroCampo(this.plazaEdicion, 'refSueldoMensualNeto', 'sueldoMensualNeto'),
      indAccesoCredito: this.obtenerNumeroCampo(this.plazaEdicion, 'indAccesoCredito', 'accesoCredito'),
      refCredHipotecarioImporte: this.obtenerNumeroCampo(this.plazaEdicion, 'refCredHipotecarioImporte', 'creditoHipotecario'),
      refCredAutomotrizImporte: this.obtenerNumeroCampo(this.plazaEdicion, 'refCredAutomotrizImporte', 'creditoAutomotriz'),
      refCredHipotecarioQuincenal: this.obtenerNumeroCampo(this.plazaEdicion, 'refCredHipotecarioQuincenal', 'descuentoQuincenalCreditoHipotecario'),
      refCredAutomotrizQuincenal: this.obtenerNumeroCampo(this.plazaEdicion, 'refCredAutomotrizQuincenal', 'descuentoQuincenalCreditoAutomotriz'),
      refBonoDificilCobertura: this.obtenerNumeroCampo(this.plazaEdicion, 'refBonoDificilCobertura', 'bonoDificilCobertura'),
      refAltoCostoVida: this.obtenerNumeroCampo(this.plazaEdicion, 'refAltoCostoVida', 'porcAltoCostoVida'),
    };
  }

  private inicializarCascadaZonas(): void {
    this.form.controls.ooad.valueChanges.pipe(
      distinctUntilChanged(),
      tap(() => {
        this.zonas = [];
        this.form.controls.zona.reset('', { emitEvent: false });
      }),
      switchMap(cveOoad => {
        if (!cveOoad) {
          return of([]);
        }

        return this._CatalogoGenService.getZonas(String(cveOoad)).pipe(
          map(({ respuesta }: HttpRespuesta<ZonaCatalogo[]>) => this.mapearCatalogo(
            respuesta,
            'desZona',
            'cveZona'
          ).sort((a, b) => a.label.localeCompare(b.label))),
          catchError(() => {
            this.alertService.error('Ocurrio un error al cargar las zonas.');
            return of([]);
          })
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(zonas => {
      this.zonas = zonas;
      this.aplicarZonaEdicionPendiente();
    });
  }

  private aplicarZonaEdicionPendiente(): void {
    if (this.zonaEdicionPendiente === null || this.zonas.length === 0) {
      return;
    }

    const zona = this.obtenerValorOpcion(
      this.zonas,
      this.zonaEdicionPendiente.value,
      this.zonaEdicionPendiente.descripcion
    );

    if (zona === '') {
      this.zonaEdicionPendiente = null;
      return;
    }

    this.form.controls.zona.setValue(zona as any, { emitEvent: false });
    this.form.controls.zona.markAsPristine();
    this.zonaEdicionPendiente = null;
  }

  private validarNumeroPlazaEdicion(): boolean {
    if (!this.modoEdicion || this.obtenerNumeroSolicitud(this.form.controls.numeroPlaza.value) !== undefined) {
      return true;
    }

    this.alertService.alerta('Ingresa un numero de plaza valido.');
    return false;
  }

  private obtenerIdPlazaEdicion(): number | null {
    const idPlazaQuery = Number(this.activatedRoute.snapshot.queryParamMap.get('idPlaza'));

    if (Number.isFinite(idPlazaQuery) && idPlazaQuery > 0) {
      return idPlazaQuery;
    }

    const plazaState = this.obtenerPlazaDesdeEstadoNavegacion();

    return plazaState?.idPlaza ? Number(plazaState.idPlaza) : null;
  }

  private obtenerPlazaDesdeEstadoNavegacion(): DetallePlazaResponse | null {
    const state = history.state as { plaza?: DetallePlazaResponse };

    return state?.plaza?.idPlaza ? state.plaza : null;
  }

  private buscarOpcion(options: CatalogoOption[], value: string | number): CatalogoOption | undefined {
    return options.find(option => String(option.value) === String(value));
  }

  private obtenerValorOpcion(options: CatalogoOption[], value?: unknown, descripcion?: unknown): string | number {
    const valorNormalizado = this.normalizarTexto(value);

    if (valorNormalizado) {
      const opcionPorValor = options.find(option => this.normalizarTexto(option.value) === valorNormalizado);

      if (opcionPorValor) {
        return opcionPorValor.value;
      }

      const opcionPorValorNumerico = options.find(option =>
        this.sonValoresNumericosCompatibles(option.value, value)
      );

      if (opcionPorValorNumerico) {
        return opcionPorValorNumerico.value;
      }
    }

    const descripcionNormalizada = this.normalizarTexto(descripcion);

    if (descripcionNormalizada) {
      const opcionPorDescripcion = options.find(option => this.normalizarTexto(option.label) === descripcionNormalizada);

      if (opcionPorDescripcion) {
        return opcionPorDescripcion.value;
      }

      const opcionPorDescripcionCompatible = options.find(option =>
        this.sonTextosCatalogoCompatibles(option.label, descripcionNormalizada)
      );

      if (opcionPorDescripcionCompatible) {
        return opcionPorDescripcionCompatible.value;
      }
    }

    return this.normalizarValor(value);
  }

  private sonValoresNumericosCompatibles(optionValue: unknown, value: unknown): boolean {
    const optionNumber = this.obtenerNumeroCatalogo(optionValue);
    const valueNumber = this.obtenerNumeroCatalogo(value);

    return optionNumber !== undefined && valueNumber !== undefined && optionNumber === valueNumber;
  }

  private obtenerNumeroCatalogo(value: unknown): number | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }

    const texto = String(value).trim();

    if (!/^\d+$/.test(texto)) {
      return undefined;
    }

    const numero = Number(texto);

    return Number.isFinite(numero) ? numero : undefined;
  }

  private sonTextosCatalogoCompatibles(label: unknown, descripcionNormalizada: string): boolean {
    const labelNormalizado = this.normalizarTextoCatalogo(label);
    const descripcionCatalogo = this.normalizarTextoCatalogo(descripcionNormalizada);

    if (labelNormalizado.length < 3 || descripcionCatalogo.length < 3) {
      return false;
    }

    return labelNormalizado.includes(descripcionCatalogo)
      || descripcionCatalogo.includes(labelNormalizado)
      || this.obtenerRaizCatalogo(labelNormalizado) === this.obtenerRaizCatalogo(descripcionCatalogo);
  }

  private obtenerRaizCatalogo(value: string): string {
    return value.length > 3 ? value.replace(/[AO]$/, '') : value;
  }

  private normalizarTextoCatalogo(value: unknown): string {
    return this.normalizarTexto(value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Z0-9]/g, '');
  }

  private obtenerCampo(plaza: DetallePlazaResponse, ...campos: string[]): unknown {
    for (const campo of campos) {
      const valor = plaza[campo];

      if (valor !== undefined && valor !== null && String(valor).trim() !== '') {
        return valor;
      }
    }

    return undefined;
  }

  private obtenerTextoCampo(plaza: DetallePlazaResponse, ...campos: string[]): string | undefined {
    const valor = this.obtenerCampo(plaza, ...campos);

    if (valor === undefined) {
      return undefined;
    }

    return String(valor);
  }

  private obtenerNumeroCampo(plaza: DetallePlazaResponse, ...campos: string[]): number | undefined {
    const valor = this.obtenerCampo(plaza, ...campos);

    if (typeof valor === 'boolean') {
      return valor ? 1 : 0;
    }

    return this.obtenerNumeroSolicitud(this.normalizarValor(valor));
  }

  private obtenerValorSolicitud(value: string | number): string | number | undefined {
    if (typeof value === 'string' && value.trim() === '') {
      return undefined;
    }

    return value;
  }

  private obtenerTextoSolicitud(value: string | number): string | undefined {
    const valor = this.obtenerValorSolicitud(value);

    return valor === undefined ? undefined : String(valor);
  }

  private obtenerNumeroSolicitud(value: string | number): number | undefined {
    const valor = this.obtenerTextoSolicitud(value);

    if (!valor) {
      return undefined;
    }

    const numero = Number(valor);

    return Number.isFinite(numero) ? numero : undefined;
  }

  private mapearAdscripciones(items: AdscripcionPlaza[] = []): CatalogoOption[] {
    return items.map(item => ({
      label: String(item.descAdscripcion ?? item.desAdscripcion ?? ''),
      value: this.normalizarValor(item.cveUnidad ?? item.cveAdscripcion)
    }));
  }

  private mapearCatalogo<T, TLabel extends keyof T, TValue extends keyof T>(items: T[] = [], label: TLabel, value: TValue): CatalogoOption[] {
    return items.map(item => ({
      label: String(item[label] ?? ''),
      value: this.normalizarValor(item[value])
    }));
  }

  private normalizarTexto(value: unknown): string {
    if (value === undefined || value === null) {
      return '';
    }

    return String(value).trim().toUpperCase();
  }

  private normalizarValor(value: unknown): string | number {
    if (typeof value === 'number' || typeof value === 'string') {
      return value;
    }

    return value == null ? '' : String(value);
  }

  private obtenerMensajeExito(): string {
    return this.modoEdicion ? 'Registro actualizado exitosamente.' : 'Plaza registrada con exito.';
  }

  private obtenerMensajeError(): string {
    return this.modoEdicion ? 'Ocurrio un error al actualizar la plaza.' : 'Ocurrio un error al registrar la plaza.';
  }

  private generarNumeroPlaza(): string {
    return this.consecutivo.toString().padStart(6, '0');
  }

}
