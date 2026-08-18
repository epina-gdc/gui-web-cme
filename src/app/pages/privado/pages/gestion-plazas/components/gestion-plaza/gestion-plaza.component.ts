import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Card } from 'primeng/card';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { PaginatorState } from 'primeng/paginator';
import { GeneralComponent } from '@components/general.component';
import { TipoDropdown } from '@models/tipo-dropdown.interface';
import { GestionPlazaInterface, TipoBusquedaPlaza } from '@models/gestion-plaza.interface';
import { mapearArregloTipoDropdown } from '@utils/funciones';
import { DUMMIE_TABLA_GESTION_PLAZAS } from '../../dummies';
import { Mensajes } from '@utils/mensajes';
import { GestionPlazaService } from '@services/gestion-plaza.service';
import { TablaPlazasComponent } from '../tabla-plazas/tabla-plazas.component';
import { OnlyNumbersDirective } from '@directives/only-numbers.directive';
import { AlertService } from '@services/alert.service';

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
    TablaPlazasComponent,
    OnlyNumbersDirective
  ],
  templateUrl: './gestion-plaza.component.html',
  styleUrl: './gestion-plaza.component.scss'
})
export class GestionPlazaComponent extends GeneralComponent implements OnInit {
  readonly TipoBusquedaPlaza = TipoBusquedaPlaza;

  formBusqueda!: FormGroup;
  fb: FormBuilder = inject(FormBuilder);
  mensajes = inject(Mensajes);
  alertaService: AlertService = inject(AlertService);
  gestionPlazaService = inject(GestionPlazaService);

  lstOoad: TipoDropdown[] = [];

  readonly plazasDummies: GestionPlazaInterface[] = DUMMIE_TABLA_GESTION_PLAZAS;

  plazas: WritableSignal<GestionPlazaInterface[]> = signal<GestionPlazaInterface[]>([]);

  first: number = 0;
  rows: number = 10;
  totalRecords: number = 100;

  ngOnInit(): void {

    this.gestionPlazaService.setTipoBusqueda(TipoBusquedaPlaza.BusquedaLayout);

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

    // Consumir servicio para consulta de plazas
    this.plazas.set(this.plazasDummies);
    this.first = 0;

    this.alertaService.error(this.mensajes.MSG024);

    // Si no se encuentran plazas mostrar MSG024
    // this.mensajes.MSG024;
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

  verDetalle(plaza: GestionPlazaInterface): void {
    console.log('Ver detalle de plaza:', plaza);
  }

  editarEstatus(plaza: GestionPlazaInterface): void {
    console.log('Editar estatus de plaza:', plaza);
  }

  editar(plaza: GestionPlazaInterface): void {
    console.log('Editar plaza:', plaza);
  }

  eliminar(plaza: GestionPlazaInterface): void {
    console.log('Eliminar plaza:', plaza);
  }

  abrirModalNuevaPlaza(): void {
    console.log('Abrir modal nueva plaza');
  }

  exportarDatos(): void {
    console.log('Exportar datos de plazas');
  }


  accionPlazaSeleccionada(plaza: GestionPlazaInterface){
    console.log(plaza)
  }
}

