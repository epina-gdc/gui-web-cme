import {Component, inject, signal, WritableSignal} from '@angular/core';
import {Card} from 'primeng/card';
import {CatalogosGeneralesService} from '@services/catalogos-generales.service';
import {LoaderService} from '../../../../components/loader/services/loader.service';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {TipoDropdown} from '@models/tipo-dropdown.interface';
import {Select} from 'primeng/select';
import {KpiCardComponent} from '../../../../components/kpi-card/kpi-card.component';
import {OfertaCardComponent} from '../../../../components/oferta-card/oferta-card.component';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-oferta-laboral',
  imports: [
    Card,
    ReactiveFormsModule,
    Select,
    KpiCardComponent,
    OfertaCardComponent,
    Button
  ],
  templateUrl: './oferta-laboral.component.html',
  styleUrl: './oferta-laboral.component.scss'
})
export class OfertaLaboralComponent {

  fb: FormBuilder = inject(FormBuilder);

  formTablero!: FormGroup;

  ooad_tablero: TipoDropdown[] = [];
  zona_tablero: TipoDropdown[] = [];
  especialidad_tablero: TipoDropdown[] = [];
  regimen_tablero: TipoDropdown[] = [];
  bono_tablero: TipoDropdown[] = [];

  constructor() {
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
      id: '1000',
      name: 'Ver oportunidades',
      icono: 'cme-search',
      description: 'Oportunidades de trabajo',
      price: 65,
    },
    {
      id: '1001',
      name: 'Mis favoritos',
      icono: 'cme-fav',
      description: 'Ver solicitudes seleccionadas',
      price: 72,
    },
    {
      id: '1002',
      name: 'Preguntas frecuentes',
      icono: 'cme-quest',
      description: 'Respuestas a las preguntas del proceso',
      price: 79,
    },
  ];
}
