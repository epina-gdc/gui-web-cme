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
import { NuevaPlazaCatalogos } from '@services/nueva-plaza.service';
import { of } from 'rxjs';
import { catchError, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
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



  private consecutivo = 1;
  private readonly plazasExistentes = new Set<string>(['000009', '000128']);

  readonly maxObservaciones = 500;

  readonly form = this.fb.nonNullable.group({
    ooad: ['', Validators.required],
    numeroPlaza: [this.generarNumeroPlaza(), Validators.required],
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

  readonly estatus: CatalogoOption[] = [
    { label: 'Vacante', value: 'VACANTE' },
    { label: 'Etiquetada', value: 'ETIQUETADA' }
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
    return this.form.invalid;
  }

  get caracteresObservaciones(): number {
    return this.form.controls.observaciones.value.length;
  }

  limpiar(): void {
    this.form.reset({
      ooad: '',
      numeroPlaza: this.generarNumeroPlaza(),
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

    if (this.form.invalid) {
      return;
    }

    const numeroPlaza = this.form.controls.numeroPlaza.value;

    if (this.plazasExistentes.has(numeroPlaza)) {
      this.alertService.alerta('La plaza ya existe, por favor verifica tu informacion.');
      return;
    }

    this.plazasExistentes.add(numeroPlaza);
    this.consecutivo++;
    this.alertService.exito('Plaza registrada con exito.');
    this.limpiar();

    setTimeout(() => {
      this.router.navigate(['/privado/nueva-plaza']);
    }, 2000)

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
