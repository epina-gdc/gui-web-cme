import {Component, inject, input, InputSignal, signal, WritableSignal} from '@angular/core';
import {Card} from 'primeng/card';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {TipoDropdown} from '@models/tipo-dropdown.interface';
import {Select} from 'primeng/select';
import {KpiCardComponent} from '../../../../components/kpi-card/kpi-card.component';
import {OfertaCardComponent} from '../../../../components/oferta-card/oferta-card.component';
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
export class OfertaLaboralComponent {

  first: number = 0;
  rows: number = 10;

  numPaginaActual: number = 0;
  totalElementos: number = 0;
  paginasTotales: number = 0;

  fb: FormBuilder = inject(FormBuilder);
  ref: DynamicDialogRef | undefined;

  activeTab: WritableSignal<number> = signal(0);

  registros: InputSignal<any[]> = input([{id: 0}])

  formTablero!: FormGroup;

  ooad_tablero: TipoDropdown[] = [];
  zona_tablero: TipoDropdown[] = [];
  especialidad_tablero: TipoDropdown[] = [];
  regimen_tablero: TipoDropdown[] = [];
  bono_tablero: TipoDropdown[] = [];

  constructor(public dialogService: DialogService) {
    this.formTablero = this.asignarFormTablero();
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
      price: 65,
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

  show() {
    this.ref = this.dialogService.open(DetalleOfertaLaboralComponent, {
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
}
