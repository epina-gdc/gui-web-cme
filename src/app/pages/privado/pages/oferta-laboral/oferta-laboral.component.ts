import {Component, inject, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {Card} from 'primeng/card';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {TipoDropdown} from '@models/tipo-dropdown.interface';
import {Select} from 'primeng/select';
import {KpiCardComponent} from '@components/kpi-card/kpi-card.component';
import {OfertaCardComponent} from '@components/oferta-card/oferta-card.component';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {CommonModule, CurrencyPipe, NgClass} from '@angular/common';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {DetalleOfertaLaboralComponent} from '@privado/detalle-oferta-laboral/detalle-oferta-laboral.component';
import {FooterMedicoComponent} from '@pages/privado/shared/footer-medico/footer-medico.component';
import {
  HeaderMedicoDetalleOfertaComponent
} from '@pages/privado/shared/header-medico-detalle-oferta/header-medico-detalle-oferta.component';
import {Paginator, PaginatorState} from 'primeng/paginator';
import {PrimeTemplate} from 'primeng/api';
import {GeneralComponent} from '@components/general.component';
import {mapearArregloTipoDropdown} from '@utils/funciones';
import {ActivatedRoute} from '@angular/router';
import {concatMap, forkJoin, of, Subscription, switchMap, tap, throttleTime} from 'rxjs';
import {EstadoOfertaService} from '@services/estado-oferta.service';

import {OportunidadLaboral} from '@models/oportunidad-laboral.interface';
import {PreguntasFrecuentes} from '@models/preguntas-frecuentes.interface';
import {UserService} from '@services/user.service';
import {SesionUser} from '@models/sesion-user.interface';
import {TableLazyLoadEvent} from 'primeng/table';
import {DrawerModule} from 'primeng/drawer';
import {ClickService} from '@services/click.service';
import {HttpRespuesta} from '@models/http-respuesta.interface';
import {ConvocatoriaActiva} from '@models/convocatoria.interface';
import {FiltrosOfertaLaboralRequest} from '@models/plaza-catalogos.interface';
import {OnlyNumbersDirective} from '@directives/only-numbers.directive';

@Component({
  selector: 'app-oferta-laboral',
  imports: [
    Card,
    ReactiveFormsModule,
    Select,
    KpiCardComponent,
    OfertaCardComponent,
    Button,
    InputText,
    NgClass,
    Paginator,
    PrimeTemplate,
    CommonModule,
    DrawerModule,
    OnlyNumbersDirective
  ],
  templateUrl: './oferta-laboral.component.html',
  styleUrl: './oferta-laboral.component.scss',
  providers: [DialogService, CurrencyPipe]
})
export class OfertaLaboralComponent extends GeneralComponent implements OnInit, OnDestroy {
  private readonly ID_TIPO_CONVOCATORIA_MINIDRAFT = 2;
  blnSinResultados = false;
  clickService = inject(ClickService);
  userService = inject(UserService);
  userData: SesionUser | null = null;

  subscription!: Subscription;

  first: number = 0;
  rows: number = 10;

  numPaginaActual: number = 0;
  totalElementos: number = 0;

  fb: FormBuilder = inject(FormBuilder);
  ref: DynamicDialogRef | undefined;

  activeTab: WritableSignal<number> = signal(0);

  registros: WritableSignal<OportunidadLaboral[]> = signal([])
  cantidadOfertasLaborales: WritableSignal<number> = signal(0);
  cantidadNuevosHospitales: WritableSignal<number> = signal(0);
  cantidadNuevosHospitalesFiltro: WritableSignal<number> = signal(0);
  cantidadSalarioPromedio: WritableSignal<string> = signal("");

  formTablero!: FormGroup;

  ooad_tablero: TipoDropdown[] = [];
  zona_tablero: TipoDropdown[] = [];
  unidad_tablero: TipoDropdown[] = [];
  especialidad_tablero: TipoDropdown[] = [];
  marca_ocupacion_tablero: TipoDropdown[] = [];
  turno_tablero: TipoDropdown[] = [];
  horario_tablero: TipoDropdown[] = [];
  regimen_tablero: TipoDropdown[] = [];
  bono_tablero: TipoDropdown[] = [];
  default_catalogo: TipoDropdown = {value:0,label:'Seleccione una opción'};
  preguntas_frecuentes: WritableSignal<PreguntasFrecuentes[]> = signal([]);

  private favoritosSubscription: Subscription = new Subscription();
  private ofertasSubscription: Subscription = new Subscription();

  visible: boolean = false;
  mostrarFiltroBonoDificilCobertura = true;
  private idTipoConvocatoriaActiva: number | null = null;


  constructor(
    public dialogService: DialogService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly estadoOfertaService: EstadoOfertaService,
    private readonly currencyPipe: CurrencyPipe) {
    super();
    this.formTablero = this.asignarFormTablero();
    this.obtenerCatalogos();
    this.suscribirObservables();
    this.obtenerConvocatoriaActiva();
    this.obtenerTotalesGenerales();
  }

  asignarFormTablero(): FormGroup {
    return this.fb.group({
      ooad_tablero: [],
      zona_tablero: [],
      unidad_tablero: [{value: null, disabled: true}],
      especialidad_tablero: [],
      marca_ocupacion_tablero: [{value: null, disabled: true}],
      turno_tablero: [{value: null, disabled: true}],
      horario_tablero: [{value: null, disabled: true}],
      plaza_tablero: [],
      regimen_tablero: [],
      bono_tablero: []
    })
  }

  data = [
    {
      id: 0,
      name: 'Ver oportunidades',
      icono: 'cme-search',
      description: 'Oportunidades de trabajo',
      price: 0,
    },
    {
      id: 1,
      name: 'Mis favoritos',
      icono: 'cme-fav',
      description: 'Ver solicitudes seleccionadas',
      price: 0,
    },
    {
      id: 2,
      name: 'Preguntas frecuentes',
      icono: 'cme-quest',
      description: 'Respuestas a las preguntas del proceso',
    }
    /*,

    SE SOLICITA OCULTAR ESTA SECCIÓN POR EL MOMENTO
    08/01/26
{
      id: 3,
      name: 'Ubicación de las Secciones de Evaluación del Comportamiento Laboral a nivel nacional',
      icono: 'cme-marker-pin',
      description: 'Consulte ubicación',
      ruta: 'https://sites.google.com/view/draft-2025/inicio'
    } */
  ];

  actualizarTab(id: number) {
    this.visible = false;
/*
 SE SOLICITA OCULTAR ESTA SECCIÓN POR EL MOMENTO
    08/01/26
    if (id === 3) {
      const url = this.data[3].ruta;
      window.open(url, '_blank');
      return;
    } */
    if (id === 1) {
      this.formTablero.reset({});
      this.resetFiltrosDependientes();
      this.consultarFavoritos();
    }
    if (id === 0) {
      this.formTablero.reset({});
      this.resetFiltrosDependientes();
      this.consultarPlazas();
    }
    this.activeTab.update(() => id);
  }

  show(oportunidad: OportunidadLaboral) {
    this._CatalogoGenService.getDocumentos(oportunidad.cveOoad!, oportunidad.cveZona)
      .pipe(
        switchMap(referencias => {

            let pdfSede;
            let pdfUbicacion;
            referencias.respuesta.sedesPdf ? pdfSede = this.documentoService.obtenerDocSede(referencias.respuesta.sedesPdf.refGuid) : pdfSede = of(null);
            referencias.respuesta.docPdf ? pdfUbicacion = this.documentoService.obtenerDocsPorOoad(referencias.respuesta.docPdf.refGuid) : pdfUbicacion = of(null);
            return forkJoin([of(referencias), pdfSede, pdfUbicacion])
          }
        ),
      )
      .subscribe({
        next: (ref) => {
          this.ref = this.dialogService.open(DetalleOfertaLaboralComponent, {
            data: {
              ...oportunidad,
              ref,
              idTipoConvocatoria: this.idTipoConvocatoriaActiva,
              ooadSedesOptions: this.obtenerOpcionesOoadParaDetalle()
            },
            modal: true,
            width: '848px',
            height: '85vh',
            focusOnShow: false,
            breakpoints: {
              '960px': '75vw',
              '640px': '90vw'
            },
            templates: {
              footer: FooterMedicoComponent,
              header: HeaderMedicoDetalleOfertaComponent
            },
            styleClass: 'oferta-detail'
          });
        }
      });
  }

  private obtenerOpcionesOoadParaDetalle(): TipoDropdown[] {
    return this.ooad_tablero.filter(ooad => ooad.value !== this.default_catalogo.value);
  }


  seleccionarPaginacion(event?: TableLazyLoadEvent): void {
    if (event) {
      this.numPaginaActual = Math.floor((event.first ?? 0) / (event.rows ?? 1));
    }
    if (this.activeTab() === 0) {
      this.consultarPlazas("btn");
    } else {
      this.consultarFavoritos();
    }
  }

  cambiarPagina(event: PaginatorState): void {
    if (event.page) {
      this.numPaginaActual = event.page;
    }
    if (this.activeTab() === 0) {
      this.consultarPlazas();
    } else {
      this.consultarFavoritos();
    }
  }

  obtenerCatalogos(): void {
    this.activatedRoute.data.subscribe(({respuesta_oferta}) => {
      const [ooad, especialidad, regimen, bono, preguntas] = respuesta_oferta;

      this.ooad_tablero = mapearArregloTipoDropdown(ooad.respuesta, 'desOoad', 'cveOoad');
      this.especialidad_tablero = mapearArregloTipoDropdown(especialidad, 'desEspecialidad', 'cveEspecialidad');
      this.regimen_tablero = mapearArregloTipoDropdown(regimen.respuesta, 'regimen');
      this.bono_tablero = mapearArregloTipoDropdown(bono.respuesta, 'bono', 'cveBono');
      this.preguntas_frecuentes.update(pf => preguntas.respuesta);
      this.ooad_tablero.unshift(this.default_catalogo);
      this.especialidad_tablero.unshift(this.default_catalogo);
      this.regimen_tablero.unshift(this.default_catalogo);
      this.bono_tablero.unshift(this.default_catalogo);
    });
  }

  private obtenerConvocatoriaActiva(): void {
    this._CatalogoGenService.getConvocatoriaActiva().subscribe({
      next: (response: HttpRespuesta<ConvocatoriaActiva | undefined>) => {
        const idTipoConvocatoria = this.obtenerIdTipoConvocatoria(response.respuesta);
        this.idTipoConvocatoriaActiva = idTipoConvocatoria;
        this.actualizarVisibilidadFiltroBono(idTipoConvocatoria);
      },
      error: (error) => {
        console.log('Error al consultar convocatoria activa', error);
        this.idTipoConvocatoriaActiva = null;
        this.actualizarVisibilidadFiltroBono(null);
      }
    });
  }

  private obtenerIdTipoConvocatoria(convocatoria?: ConvocatoriaActiva): number | null {
    const idTipoConvocatoria = convocatoria?.tipo?.idTipoConvocatoria
      ?? (convocatoria as { idTipoConvocatoria?: number } | undefined)?.idTipoConvocatoria;

    return idTipoConvocatoria === null || idTipoConvocatoria === undefined ? null : Number(idTipoConvocatoria);
  }

  private actualizarVisibilidadFiltroBono(idTipoConvocatoria: number | null): void {
    this.mostrarFiltroBonoDificilCobertura = idTipoConvocatoria !== this.ID_TIPO_CONVOCATORIA_MINIDRAFT;

    if (!this.mostrarFiltroBonoDificilCobertura) {
      this.formTablero.get('bono_tablero')?.reset();
    }
  }

  suscribirObservables(): void {
    this.formTablero.get('ooad_tablero')?.valueChanges.subscribe(value => {
      this.zona_tablero = [];
      this.formTablero.get('zona_tablero')?.setValue(null);
      this.resetUnidad();
      if(!value || value.value == 0){
        this.formTablero.get('zona_tablero')?.reset();
        return;
      }
      this.obtenerZonasPorOoad(value);
      this.obtenerUnidades();
    });

    this.formTablero.get('especialidad_tablero')?.valueChanges.subscribe(() => {
      this.resetUnidad();
      this.resetMarcaOcupacion();
      this.resetTurno();
      this.resetHorario();
      this.obtenerUnidades();
      this.obtenerMarcasOcupacion();
      this.obtenerTurnos();
    });

    this.formTablero.get('turno_tablero')?.valueChanges.subscribe(() => {
      this.resetHorario();
      this.obtenerHorarios();
    });
  }

  obtenerZonasPorOoad(ooad: any): void {
    if (!ooad) return;
    this._CatalogoGenService.getLstZonas(ooad.value).subscribe({
      next: (valor) => {
        if (valor.exito && Array.isArray(valor.respuesta) && valor.respuesta.length > 0) {
          this.zona_tablero = mapearArregloTipoDropdown(valor.respuesta, 'desZona', 'cveZona');
          this.zona_tablero.unshift(this.default_catalogo);
          return;
        }
        this._alertServices.alerta(valor.mensaje);
      },
       error: () => {
        this.zona_tablero = [];
        this.formTablero.get('zona_tablero')?.setValue([]);
        console.log('Ocurrio un error con la búsqueda de zonas');
      }
    });
  }

  obtenerUnidades(): void {
    const cveEspecialidad = this.obtenerValorControlComoString('especialidad_tablero');
    const cveOoad = this.obtenerValorControlComoString('ooad_tablero');
    const unidadCtrl = this.formTablero.get('unidad_tablero');

    if (!cveEspecialidad || !cveOoad) {
      this.resetUnidad();
      return;
    }

    unidadCtrl?.enable({emitEvent: false});

    this._ConvocatoriaService.getUnidadesOfertaLaboral(cveEspecialidad, cveOoad).subscribe({
      next: (result) => {
        if (this.obtenerValorControlComoString('especialidad_tablero') !== cveEspecialidad
          || this.obtenerValorControlComoString('ooad_tablero') !== cveOoad) {
          return;
        }

        if (result.exito && Array.isArray(result.respuesta) && result.respuesta.length > 0) {
          this.unidad_tablero = this.agregarDefaultCatalogo(
            mapearArregloTipoDropdown(result.respuesta, 'descUnidad', 'cveUnidad')
          );
          return;
        }

        this.unidad_tablero = [];
      },
      error: () => {
        this.unidad_tablero = [];
        console.log('Ocurrio un error con la búsqueda de unidades');
      }
    });
  }

  obtenerMarcasOcupacion(): void {
    const cveEspecialidad = this.obtenerValorControlComoString('especialidad_tablero');
    const marcaCtrl = this.formTablero.get('marca_ocupacion_tablero');

    if (!cveEspecialidad) {
      this.resetMarcaOcupacion();
      return;
    }

    marcaCtrl?.enable({emitEvent: false});

    this._ConvocatoriaService.getMarcasOcupacionOfertaLaboral(cveEspecialidad).subscribe({
      next: (result) => {
        if (this.obtenerValorControlComoString('especialidad_tablero') !== cveEspecialidad) {
          return;
        }

        if (result.exito && Array.isArray(result.respuesta) && result.respuesta.length > 0) {
          this.marca_ocupacion_tablero = this.agregarDefaultCatalogo(
            mapearArregloTipoDropdown(result.respuesta, 'descMarcaOcupacion', 'cveMarcaOcupacion')
          );
          return;
        }

        this.marca_ocupacion_tablero = [];
      },
      error: () => {
        this.marca_ocupacion_tablero = [];
        console.log('Ocurrio un error con la búsqueda de marcas por ocupación');
      }
    });
  }

  obtenerTurnos(): void {
    const cveEspecialidad = this.obtenerValorControlComoString('especialidad_tablero');
    const turnoCtrl = this.formTablero.get('turno_tablero');

    if (!cveEspecialidad) {
      this.resetTurno();
      return;
    }

    turnoCtrl?.enable({emitEvent: false});

    this._ConvocatoriaService.getTurnosOfertaLaboral(cveEspecialidad).subscribe({
      next: (result) => {
        if (this.obtenerValorControlComoString('especialidad_tablero') !== cveEspecialidad) {
          return;
        }

        if (result.exito && Array.isArray(result.respuesta) && result.respuesta.length > 0) {
          this.turno_tablero = this.agregarDefaultCatalogo(
            mapearArregloTipoDropdown(result.respuesta, 'descTurno', 'cveTurno')
          );
          return;
        }

        this.turno_tablero = [];
      },
      error: () => {
        this.turno_tablero = [];
        console.log('Ocurrio un error con la búsqueda de turnos');
      }
    });
  }

  obtenerHorarios(): void {
    const cveEspecialidad = this.obtenerValorControlComoString('especialidad_tablero');
    const cveTurno = this.obtenerValorControlComoNumber('turno_tablero');
    const horarioCtrl = this.formTablero.get('horario_tablero');

    if (!cveEspecialidad || !cveTurno) {
      this.resetHorario();
      return;
    }

    horarioCtrl?.enable({emitEvent: false});

    this._ConvocatoriaService.getHorariosOfertaLaboral(cveEspecialidad, cveTurno).subscribe({
      next: (result) => {
        if (this.obtenerValorControlComoString('especialidad_tablero') !== cveEspecialidad
          || this.obtenerValorControlComoNumber('turno_tablero') !== cveTurno) {
          return;
        }

        if (result.exito && Array.isArray(result.respuesta) && result.respuesta.length > 0) {
          this.horario_tablero = this.agregarDefaultCatalogo(
            mapearArregloTipoDropdown(result.respuesta, 'descHorario', 'cveHorario')
          );
          return;
        }

        this.horario_tablero = [];
      },
      error: () => {
        this.horario_tablero = [];
        console.log('Ocurrio un error con la búsqueda de horarios');
      }
    });
  }

  consultarPlazas(referencia: string = "paginado") {
    this.blnSinResultados = false;
    if (referencia == "btn") {
      this.numPaginaActual = 0;
      this.first = 0;
    }
    const filtros = this.generarSolicitudFiltros();

    const parameters = {
      "page": this.numPaginaActual,
      "size": this.rows,
      "sort": 'idPlaza,asc'
    }

    //Encadenamiento de subscribes
    this._ConvocatoriaService.consultarPlazas(filtros, parameters).pipe(
      tap(ofertas => {
        //settear paginado y oferta-card
        this.totalElementos = ofertas.page.totalElements;
        this.registros.set(ofertas.content)
      }),
      concatMap(() => this._ConvocatoriaService.consultarTotales(
        this.generarSolicitudFiltrosTotales(filtros)
      ))
    ).subscribe({
      next: (respuesta: any) => {
        if(respuesta.respuesta.totalResultados == 0){
          //this._alertServices.alerta(this._Mensajes.MSG041);
          this.blnSinResultados = true;
        }
        const salarioFormateado = this.currencyPipe.transform(
          respuesta.respuesta.promedioSueldosBrutos,
          'USD',
          'symbol',
          '1.2-2',
          'en-US'
        ) ?? '';

        this.cantidadOfertasLaborales.set(respuesta.respuesta.totalResultados);
        this.cantidadNuevosHospitalesFiltro.set(respuesta.respuesta.totalHospitalesNuevos);
        this.cantidadSalarioPromedio.set(salarioFormateado);
      }
    });

  }

  consultarFavoritos(): void {

    const filtros = this.generarSolicitudFiltros();
    const parametros = this.generarSolicitudParametros();

    this._ConvocatoriaService.consultarFavoritos(filtros, parametros).pipe(
      tap(ofertas => {
        //settear paginado y oferta-card
        this.totalElementos = ofertas.page.totalElements;
        this.registros.set(ofertas.content)
      }),
      concatMap(() => this._ConvocatoriaService.consultarTotalesFavoritos(filtros))
    ).subscribe({
      next: (respuesta: any) => {
        if(respuesta.respuesta.totalFavoritas == 0){
          //this._alertServices.alerta(this._Mensajes.MSG041);
        }
        const salarioFormateado = this.currencyPipe.transform(
          respuesta.respuesta.promedioSueldosBrutos,
          'USD',
          'symbol',
          '1.2-2',
          'en-US'
        ) ?? '';

        //console.log(respuesta.respuesta)

        this.cantidadOfertasLaborales.set(respuesta.respuesta.totalFavoritas);
        this.cantidadNuevosHospitalesFiltro.set(respuesta.respuesta.totalHospitalesNuevos);
        this.cantidadSalarioPromedio.set(salarioFormateado);
      }
    });

  }

  generarSolicitudFiltros(): FiltrosOfertaLaboralRequest {
    return {
      cveEspecialidad: this.obtenerValorControlComoString('especialidad_tablero'),
      cveOoad: this.obtenerValorControlComoString('ooad_tablero'),
      cveZona: this.obtenerValorControlComoString('zona_tablero'),
      cveUnidad: this.obtenerValorControlComoString('unidad_tablero'),
      cveMarcaOcupacion: this.obtenerValorControlComoNumber('marca_ocupacion_tablero'),
      cveTurno: this.obtenerValorControlComoNumber('turno_tablero'),
      cveHorario: this.obtenerValorControlComoString('horario_tablero'),
      numPlaza: this.obtenerInputControlComoNumber('plaza_tablero'),
      cveBono: this.obtenerValorFiltroComoNumber(this.obtenerFiltroBonoSeleccionado()?.value),
      regimen: this.obtenerRegimenSeleccionado(),
      idUsuario: this.userData?.idUsuario ?? null
    }
  }

  private generarSolicitudFiltrosTotales(filtros: FiltrosOfertaLaboralRequest): Omit<FiltrosOfertaLaboralRequest, 'idUsuario'> {
    return {
      cveEspecialidad: filtros.cveEspecialidad,
      cveOoad: filtros.cveOoad,
      cveZona: filtros.cveZona,
      cveUnidad: filtros.cveUnidad,
      cveMarcaOcupacion: filtros.cveMarcaOcupacion,
      cveTurno: filtros.cveTurno,
      cveHorario: filtros.cveHorario,
      numPlaza: filtros.numPlaza,
      cveBono: filtros.cveBono,
      regimen: filtros.regimen
    };
  }

  private obtenerFiltroBonoSeleccionado(): TipoDropdown | null {
    if (!this.mostrarFiltroBonoDificilCobertura) {
      return null;
    }

    const bono = this.formTablero.get('bono_tablero')?.value;
    return bono?.value == 0 ? null : bono;
  }

  private obtenerValorFiltroComoString(value: unknown): string | null {
    return value === null || value === undefined ? null : String(value);
  }

  private obtenerValorControlComoString(controlName: string): string | null {
    const filtro = this.obtenerFiltroSeleccionado(controlName);
    return this.obtenerValorFiltroComoString(filtro?.value);
  }

  private obtenerValorControlComoNumber(controlName: string): number | null {
    const filtro = this.obtenerFiltroSeleccionado(controlName);
    return this.obtenerValorFiltroComoNumber(filtro?.value);
  }

  private obtenerValorFiltroComoNumber(value: unknown): number | null {
    const valor = value;

    if (valor === null || valor === undefined) {
      return null;
    }

    const numero = Number(valor);
    return Number.isNaN(numero) ? null : numero;
  }

  private obtenerFiltroSeleccionado(controlName: string): TipoDropdown | null {
    const value = this.formTablero.get(controlName)?.value as TipoDropdown | null | undefined;
    return !value || value.value == 0 ? null : value;
  }

  private obtenerInputControlComoNumber(controlName: string): number | null {
    const value = this.formTablero.get(controlName)?.value;
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const numero = Number(value);
    return Number.isNaN(numero) ? null : numero;
  }

  private obtenerRegimenSeleccionado(): string | null {
    const regimen = this.formTablero.get('regimen_tablero')?.value as TipoDropdown | null | undefined;

    if (!regimen || regimen.value == 0) {
      return null;
    }

    return regimen.label ?? null;
  }

  private agregarDefaultCatalogo(items: TipoDropdown[]): TipoDropdown[] {
    return items.length > 0 ? [this.default_catalogo, ...items] : [];
  }

  generalSolicitudFiltrosTotales() {
    return {
      cveEspecialidad: null,
      cveOoad: null,
      cveZona: null,
      cveUnidad: null,
      cveMarcaOcupacion: null,
      cveTurno: null,
      cveHorario: null,
      numPlaza: null,
      cveBono: null,
      regimen: null
    }
  }

  generarSolicitudFiltrosFavoritosTotales() {
    return {
      cveEspecialidad: null,
      cveOoad: null,
      cveZona: null,
      cveUnidad: null,
      cveMarcaOcupacion: null,
      cveTurno: null,
      cveHorario: null,
      numPlaza: null,
      cveBono: null,
      regimen: null,
      idUsuario: this.userData?.idUsuario as number
    }
  }

  generarSolicitudParametros() {
    return {
      page: this.numPaginaActual,
      size: this.rows,
      sort: 'idPlaza,asc'
    }
  }

  obtenerTotalesGenerales(): void {
    const solicitud = this.generalSolicitudFiltrosTotales();
    this._ConvocatoriaService.consultarTotales({...solicitud}).subscribe({
      next: (respuesta: any) => {
        this.estadoOfertaService.actualizarOfertas(respuesta.respuesta.totalResultados);
      }
    })
  }

  obtenerTotalFavoritos(): void {
    const solicitud = this.generarSolicitudFiltrosFavoritosTotales();
    this._ConvocatoriaService.consultarTotalesFavoritos({...solicitud}).subscribe({
      next: (respuesta: any) => {
        this.estadoOfertaService.actualizarFavoritos(respuesta.respuesta.totalFavoritas);
      }
    })
  }

  private resetFiltrosDependientes(): void {
    this.resetUnidad();
    this.resetMarcaOcupacion();
    this.resetTurno();
    this.resetHorario();
  }

  private resetUnidad(): void {
    this.unidad_tablero = [];
    const unidadCtrl = this.formTablero.get('unidad_tablero');
    unidadCtrl?.reset(null, {emitEvent: false});
    unidadCtrl?.disable({emitEvent: false});
  }

  private resetMarcaOcupacion(): void {
    this.marca_ocupacion_tablero = [];
    const marcaCtrl = this.formTablero.get('marca_ocupacion_tablero');
    marcaCtrl?.reset(null, {emitEvent: false});
    marcaCtrl?.disable({emitEvent: false});
  }

  private resetTurno(): void {
    this.turno_tablero = [];
    const turnoCtrl = this.formTablero.get('turno_tablero');
    turnoCtrl?.reset(null, {emitEvent: false});
    turnoCtrl?.disable({emitEvent: false});
  }

  private resetHorario(): void {
    this.horario_tablero = [];
    const horarioCtrl = this.formTablero.get('horario_tablero');
    horarioCtrl?.reset(null, {emitEvent: false});
    horarioCtrl?.disable({emitEvent: false});
  }

  ngOnInit() {
    this.blnSinResultados =false;
    this.userService.userData$.subscribe(user => this.userData = user);
    this.subscription = this.clickService.clic$.subscribe(() => {
      this.visible = true;
    });

    this.obtenerTotalFavoritos();
    this.favoritosSubscription = this.estadoOfertaService.favoritosActuales$
    .pipe(
      throttleTime(500)
    )
    .subscribe(
      (numeroFavoritos: number) => {
        const favoritos = this.data[1];
        favoritos.price = numeroFavoritos;
        if (this.activeTab() === 0) {
          this.consultarPlazas();
        } else {
          this.consultarFavoritos();
        }
      }
    );

    this.ofertasSubscription = this.estadoOfertaService.ofertasActuales$.subscribe((numOfertas => {
      const ofertas = this.data[0];
      ofertas.price = numOfertas;
    }));

  }

  ngOnDestroy() {
    this.favoritosSubscription.unsubscribe();
    this.ofertasSubscription.unsubscribe();
    this.subscription.unsubscribe();
  }


}
