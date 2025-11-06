import {Component, OnInit, OnDestroy, inject, input, InputSignal, signal, WritableSignal} from '@angular/core';
import {Card} from 'primeng/card';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {TipoDropdown} from '@models/tipo-dropdown.interface';
import {Select} from 'primeng/select';
import {KpiCardComponent} from '@components/kpi-card/kpi-card.component';
import {OfertaCardComponent} from '@components/oferta-card/oferta-card.component';
import {Button} from 'primeng/button';
import {NgClass} from '@angular/common';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {DetalleOfertaLaboralComponent} from '@privado/detalle-oferta-laboral/detalle-oferta-laboral.component';
import {FooterMedicoComponent} from '@pages/privado/shared/footer-medico/footer-medico.component';
import {
  HeaderMedicoDetalleOfertaComponent
} from '@pages/privado/shared/header-medico-detalle-oferta/header-medico-detalle-oferta.component';
import {Paginator} from 'primeng/paginator';
import {PrimeTemplate} from 'primeng/api';
import {GeneralComponent} from '@components/general.component';
import {mapearArregloTipoDropdown} from '@utils/funciones';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {EstadoOfertaService, OfertaEstado} from '@services/estado-oferta.service';

import {OportunidadLaboral} from '@models/oportunidad-laboral.interface';
import {PreguntasFrecuentes} from '@models/preguntas-frecuentes.interface';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-oferta-laboral',
  imports: [
    Card,
    ReactiveFormsModule,
    Select,
    KpiCardComponent,
    OfertaCardComponent,
    Button,
    NgClass,
    Paginator,
    PrimeTemplate
  ],
  templateUrl: './oferta-laboral.component.html',
  styleUrl: './oferta-laboral.component.scss',
  providers: [DialogService]
})
export class OfertaLaboralComponent extends GeneralComponent implements OnInit, OnDestroy {

  first: number = 0;
  rows: number = 10;

  numPaginaActual: number = 0;
  totalElementos: number = 0;
  paginasTotales: number = 0;

  fb: FormBuilder = inject(FormBuilder);
  ref: DynamicDialogRef | undefined;

  activeTab: WritableSignal<number> = signal(0);

  registros: WritableSignal<OportunidadLaboral[]> = signal([])
  cantidadOfertasLaborales: WritableSignal<number> = signal(0);

  formTablero!: FormGroup;

  ooad_tablero: TipoDropdown[] = [];
  zona_tablero: TipoDropdown[] = [];
  especialidad_tablero: TipoDropdown[] = [];
  regimen_tablero: TipoDropdown[] = [];
  bono_tablero: TipoDropdown[] = [];
  preguntas_frecuentes: WritableSignal<PreguntasFrecuentes[]> = signal([]);

  private favoritosSubscription: Subscription = new Subscription();

  constructor(public dialogService: DialogService, private readonly activatedRoute: ActivatedRoute,
              private readonly estadoOfertaService: EstadoOfertaService) {
    super();
    this.formTablero = this.asignarFormTablero();
    this.obtenerCatalogos();
    this.suscribirObservables();
  }

  asignarFormTablero(): FormGroup {
    return this.fb.group({
      ooad_tablero: [],
      zona_tablero: [],
      especialidad_tablero: [],
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
      price: this.cantidadOfertasLaborales(),
    },
    {
      id: 1,
      name: 'Mis favoritos',
      icono: 'cme-fav',
      description: 'Ver solicitudes seleccionadas',
      price: 72,
    },
    {
      id: 2,
      name: 'Preguntas frecuentes',
      icono: 'cme-quest',
      description: 'Respuestas a las preguntas del proceso',
    },
    {
      id: 3,
      name: 'Ubicación de las Unidades Médicas',
      icono: 'cme-marker-pin',
      description: 'Consulte ubicación de unidades médicas',
      ruta: 'https://sites.google.com/view/draft-2025/inicio'
    }
  ];

  actualizarTab(id: number) {
    if (id === 3) {
      const url = this.data[3].ruta;
      window.open(url, '_blank');
      return;
    }
    this.activeTab.update(() => id);
  }

  show(oportunidad: OportunidadLaboral) {
    this.ref = this.dialogService.open(DetalleOfertaLaboralComponent, {
      data: {oportunidad},
      modal: true,
      width: '60vw',
      height: '100vh',
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

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.numPaginaActual = event.page;
    this.btnConsultar("paginado");
  }

  obtenerCatalogos(): void {
    this.activatedRoute.data.subscribe(({respuesta_oferta}) => {
      const [ooad, especialidad, regimen, bono, preguntas] = respuesta_oferta;

      //this.zona_tablero = mapearArregloTipoDropdown(zona.respuesta, 'desTipoDocumentoEspecialidad', 'idTipoDocumentoEspecialidad');
      this.ooad_tablero = mapearArregloTipoDropdown(ooad.respuesta, 'desOoad', 'cveOoad');
      this.especialidad_tablero = mapearArregloTipoDropdown(especialidad.respuesta, 'desEspecialidad', 'cveEspecialidad');
      this.regimen_tablero = mapearArregloTipoDropdown(regimen.respuesta, 'regimen');
      this.bono_tablero = mapearArregloTipoDropdown(bono.respuesta, 'bono', 'cveBono');
      console.log(preguntas)
      this.preguntas_frecuentes.update(pf => preguntas.respuesta);
    });
  }

  suscribirObservables(): void {
    this.formTablero.get('ooad_tablero')?.valueChanges.subscribe(value => this.obtenerZonasPorOoad(value))
  }

  obtenerZonasPorOoad(ooad: any): void {
    if (!ooad) return;
    this._CatalogoGenService.getLstZonas(ooad.value).subscribe({
      next: (valor) => {
        if (valor.exito && Array.isArray(valor.respuesta) && valor.respuesta.length > 0) {
          this.zona_tablero = mapearArregloTipoDropdown(valor.respuesta, 'desZona', 'cveZona');
          return;
        }
        this._alertServices.alerta(valor.mensaje);
      }
    });
  }

  public btnConsultar(referencia: string = "btn") {
    if (referencia == "btn") {
      this.numPaginaActual = 0;
      this.first = 0;
    }
    const ooad = this.formTablero.get('ooad_tablero')?.value;
    const zona = this.formTablero.get('zona_tablero')?.value;
    const especialidad = this.formTablero.get('especialidad_tablero')?.value;
    const regimen = this.formTablero.get('regimen_tablero')?.value;
    const bono = this.formTablero.get('bono_tablero')?.value;


    const filtros = {
      "cveEspecialidad": especialidad?.value,
      "cveOoad": ooad?.value ?? '',
      "cveBono": bono?.label ?? '',
      "cveRegimen": regimen?.value ?? '',
      "cveZona": zona?.value ?? ''
    }

    const parameters = {
      "page": this.numPaginaActual,
      "size": this.rows,
      "sort": 'idPlaza,asc'
    }

    this._ConvocatoriaService.consultarPlazas(filtros, parameters).subscribe({
      next: (respuesta: any) => {
        this.cantidadOfertasLaborales.set(respuesta.page.totalElements)
        this.totalElementos = respuesta.page.totalElements;
        this.registros.set(respuesta.content)
      }
    });

  }

  ngOnInit() {
    this.favoritosSubscription = this.estadoOfertaService.favoritosActuales$.subscribe(
      (numeroFavoritos: number) => {
        const favoritos = this.data[1];
        favoritos.price = numeroFavoritos;
      }
    );
  }

  ngOnDestroy() {
    this.favoritosSubscription.unsubscribe();
  }


}
