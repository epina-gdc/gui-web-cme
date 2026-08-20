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
import { NuevaPlazaCatalogos, NuevaPlazaService, RegistrarPlazaRequest } from '@services/nueva-plaza.service';
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

  zonas: CatalogoOption[] = [];
  guardando = false;

  readonly estatus: CatalogoOption[] = [
    { label: 'VACANTE', value: '1' },
    { label: 'ETIQUETADA', value: '2' }
  ];

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ catalogos }) => {
        this.cargarCatalogos(catalogos as CatalogosNuevaPlazaRoute | undefined);
      });

    this.inicializarCascadaZonas();
  }

  ngOnDestroy(): void {
    console.log('Destroy');
  }

  get guardarDeshabilitado(): boolean {
    return this.form.invalid || this.guardando;
  }

  get caracteresObservaciones(): number {
    return this.form.controls.observaciones.value.length;
  }

  limpiar(): void {
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

    if (this.form.invalid || this.guardando) {
      return;
    }

    this.guardando = true;
    console.log(this.crearSolicitudRegistrarPlaza());

    this.nuevaPlazaService.registrarPlaza(this.crearSolicitudRegistrarPlaza()).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => {
        this.guardando = false;
      })
    ).subscribe({
      next: (response) => {
        if (!response.exito) {
          this.alertService.alerta(response.mensaje || 'No fue posible registrar la plaza.');
          return;
        }

        this.consecutivo++;
        this.alertService.exito(response.mensaje || 'Plaza registrada con exito.');
        this.limpiar();

        setTimeout(() => {
          this.router.navigate(['/privado/nueva-plaza']);
        }, 2000);
      },
      error: (error) => {
        this.alertService.error(error?.error?.mensaje || 'Ocurrio un error al registrar la plaza.');
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
    this.adscripciones = this.mapearCatalogo(catalogos.adscripciones.respuesta, 'descAdscripcion', 'cveAdscripcion');
    this.tiposPlaza = this.mapearCatalogo(catalogos.tiposPlaza.respuesta, 'descTipoPlaza', 'cveTipoPlaza');
    this.puestos = this.mapearCatalogo(catalogos.puestos.respuesta, 'descPuesto', 'cvePuesto');
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
      cveOoad: valores.ooad,
      descOoad: ooad?.label,
      cveZona: this.obtenerValorSolicitud(valores.zona),
      descZona: zona?.label,
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
    });
  }

  private buscarOpcion(options: CatalogoOption[], value: string | number): CatalogoOption | undefined {
    return options.find(option => String(option.value) === String(value));
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

  private mapearCatalogo<T, TLabel extends keyof T, TValue extends keyof T>(items: T[] = [], label: TLabel, value: TValue): CatalogoOption[] {
    return items.map(item => ({
      label: String(item[label] ?? ''),
      value: this.normalizarValor(item[value])
    }));
  }

  private normalizarValor(value: unknown): string | number {
    if (typeof value === 'number' || typeof value === 'string') {
      return value;
    }

    return value == null ? '' : String(value);
  }

  private generarNumeroPlaza(): string {
    return this.consecutivo.toString().padStart(6, '0');
  }

}
