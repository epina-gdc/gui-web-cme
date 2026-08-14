import { Component, inject, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Card } from 'primeng/card';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Popover, PopoverModule } from 'primeng/popover';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { GeneralComponent } from '@components/general.component';
import { PillComponent } from '@components/pill/pill.component';
import { TipoDropdown } from '@models/tipo-dropdown.interface';
import { GestionPlazaInterface, TipoBusquedaPlaza } from '@models/gestion-plaza.interface';
import { mapearArregloTipoDropdown } from '@utils/funciones';
import { DUMMIE_TABLA_GESTION_PLAZAS } from '../../dummies';
import { Mensajes } from '@utils/mensajes';

@Component({
  selector: 'app-gestion-plaza',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Card,
    Select,
    InputText,
    Button,
    TableModule,
    PopoverModule,
    PaginatorModule,
    PillComponent
  ],
  templateUrl: './gestion-plaza.component.html',
  styleUrl: './gestion-plaza.component.scss'
})
export class GestionPlazaComponent extends GeneralComponent implements OnInit {
  @ViewChild('op') op!: Popover;

  formBusqueda!: FormGroup;
  fb: FormBuilder = inject(FormBuilder);
  mensajes = inject(Mensajes);

  lstOoad: TipoDropdown[] = [];

  readonly plazasDummies: GestionPlazaInterface[] = DUMMIE_TABLA_GESTION_PLAZAS;

  plazas: WritableSignal<GestionPlazaInterface[]> = signal<GestionPlazaInterface[]>([]);
  plazaSeleccionada: GestionPlazaInterface | null = null;

  first: number = 0;
  rows: number = 10;
  totalRecords: number = 100;

  tipoConsulta: WritableSignal<number> = signal(TipoBusquedaPlaza.BusquedaLayout);

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarCatalogos();
    this.plazas.set([...this.plazasDummies]);
  }

  inicializarFormulario(): void {
    this.formBusqueda = this.fb.group({
      ooad: [null, [Validators.required]],
      noPlaza: ['']
    });
  }

  cargarCatalogos(): void {
    this._CatalogoGenService.getLstOOADS().subscribe({
      next: (response) => {
        if (response?.respuesta && response.respuesta.length > 0) {
          this.lstOoad = mapearArregloTipoDropdown(response.respuesta, 'desOoad', 'desOoad');
        }
      },
      error: (err) => {
        console.error('Error al consultar catálogo de OOAD:', err);
      }
    });
  }

  onBuscar(): void {
    if (this.formBusqueda.invalid) {
      this.formBusqueda.markAllAsTouched();
      return;
    }

    const { ooad, noPlaza } = this.formBusqueda.value;


    //Consumir servicio para consulta de plazas
    this.plazas.set(this.plazasDummies);
    this.first = 0;

    //Si no se encuentran plazas mostrar MSG024
    //this.mensajes.MSG024;
  }

  onLimpiar(): void {
    this.formBusqueda.reset();
    this.plazas.set([...this.plazasDummies]);
    this.first = 0;
  }

  onPageChange(event: PaginatorState): void {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }

  abrirAcciones(event: Event, popover: Popover, plaza: GestionPlazaInterface): void {
    this.plazaSeleccionada = plaza;
    popover.toggle(event);
  }

  verDetalle(plaza: GestionPlazaInterface | null): void {
    if (!plaza) return;
    this.op?.hide();

  }

  editarEstatus(plaza: GestionPlazaInterface | null): void {
    if (!plaza) return;
    this.op?.hide();

  }

  getPillType(estatus: string): number {
    switch (estatus?.toLowerCase()) {
      case 'vacante':
        return 3;
      case 'etiquetada':
        return 1;
      case 'ocupado':
        return 0;
      default:
        return 2;
    }
  }
}
