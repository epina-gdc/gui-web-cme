import { HttpRespuesta } from '@models/http-respuesta.interface';
import { Component, inject, input, InputSignal, signal, WritableSignal } from '@angular/core';
import { Card } from 'primeng/card';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TipoDropdown } from '@models/tipo-dropdown.interface';
import { Select } from 'primeng/select';
import { KpiCardComponent } from '../../../../components/kpi-card/kpi-card.component';
import { OfertaCardComponent } from '../../../../components/oferta-card/oferta-card.component';
import { Button } from 'primeng/button';
import { NgClass } from '@angular/common';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DetalleOfertaLaboralComponent } from '@privado/detalle-oferta-laboral/detalle-oferta-laboral.component';
import { FooterMedicoComponent } from '@pages/privado/shared/footer-medico/footer-medico.component';
import {
  HeaderMedicoDetalleOfertaComponent
} from '@pages/privado/shared/header-medico-detalle-oferta/header-medico-detalle-oferta.component';
import { Paginator } from 'primeng/paginator';
import { PrimeTemplate } from 'primeng/api';
import { GeneralComponent } from '@components/general.component';
import { mapearArregloTipoDropdown } from '@utils/funciones';
import { ActivatedRoute } from '@angular/router';
import { OportunidadLaboral } from '@models/oportunidad-laboral.interface';
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
export class OfertaLaboralComponent extends GeneralComponent {

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

  constructor(public dialogService: DialogService, private readonly activatedRoute: ActivatedRoute) {
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
      name: 'Preguntas frecuentes',
      icono: 'cme-quest',
      description: 'Respuestas a las preguntas del proceso',
    }
  ];

  actualizarTab(id: number) {
    this.activeTab.update(() => id);
  }

  show(oportunidad: OportunidadLaboral) {
    this.ref = this.dialogService.open(DetalleOfertaLaboralComponent, {
      data:{oportunidad},
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
  }


  obtenerCatalogos(): void {

    this.activatedRoute.data.subscribe(({ respuesta }) => {

      const [ooad, especialidad, regimen, bono] = respuesta;

      //this.zona_tablero = mapearArregloTipoDropdown(zona.respuesta, 'desTipoDocumentoEspecialidad', 'idTipoDocumentoEspecialidad');
      this.ooad_tablero = mapearArregloTipoDropdown(ooad.respuesta, 'desOoad', 'cveOoad');
      this.especialidad_tablero = mapearArregloTipoDropdown(especialidad, 'desEspecialidad', 'cveEspecialidad');
      this.regimen_tablero = mapearArregloTipoDropdown(regimen, 'desEspecialidad', 'cveEspecialidad')
      this.bono_tablero = mapearArregloTipoDropdown(bono.respuesta, 'bono', 'cveBono')
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

  public btnConsultar() {

    this._alertServices.exito("realzia búsqueda");
    let ooad = this.formTablero.get('ooad_tablero')?.value;
    let zona = this.formTablero.get('zona_tablero')?.value;
    let especialidad = this.formTablero.get('especialidad_tablero')?.value;
    let regimen = this.formTablero.get('regimen_tablero')?.value;
    let bono = this.formTablero.get('bono_tablero')?.value;



    let filtros = {
      "cveEspecialidad": especialidad?.value,
      "cveOoad": ooad?.value??'',
      "cveBono": bono?.label??'',
      "cveRegimen": regimen?.value??'',
      "cveZona": zona?.value??''

    }


    this._ConvocatoriaService.consultarPlazas(filtros, 0).subscribe({
      next: (respuesta: any) => {
        this.cantidadOfertasLaborales.set(respuesta.page.totalElements)
        this.totalElementos = respuesta.page.totalElements;
        this.registros.set(respuesta.content)
      }
    });
  }
}
