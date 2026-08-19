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
import { GestionPlazaInterface, TipoBusquedaPlaza, AccionPlaza } from '@models/gestion-plaza.interface';
import { mapearArregloTipoDropdown } from '@utils/funciones';
import { DUMMIE_TABLA_GESTION_PLAZAS } from '../../dummies';
import { Mensajes } from '@utils/mensajes';
import { GestionPlazaEstadoService } from '@services/gestion-plaza-estado.service';
import { TablaPlazasComponent } from '../tabla-plazas/tabla-plazas.component';
import { OnlyNumbersDirective } from '@directives/only-numbers.directive';
import { AlertService } from '@services/alert.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CambioEstatusComponent } from '../cambio-estatus/cambio-estatus.component';
import { ActivatedRoute } from '@angular/router';
import { NAV } from '@utils/url-global';

interface PlazaAccion  {
  plaza: GestionPlazaInterface,
  accion: AccionPlaza
}

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
  styleUrl: './gestion-plaza.component.scss',
  providers: [DialogService]
})
export class GestionPlazaComponent extends GeneralComponent implements OnInit {
  readonly TipoBusquedaPlaza = TipoBusquedaPlaza;

  formBusqueda!: FormGroup;
  fb: FormBuilder = inject(FormBuilder);
  mensajes = inject(Mensajes);
  alertaService: AlertService = inject(AlertService);
  gestionPlazaService = inject(GestionPlazaEstadoService);
  dialogService = inject(DialogService);
  private route = inject(ActivatedRoute);

  ref: DynamicDialogRef | undefined;

  lstOoad: TipoDropdown[] = [];

  readonly plazasDummies: GestionPlazaInterface[] = DUMMIE_TABLA_GESTION_PLAZAS;

  plazas: WritableSignal<GestionPlazaInterface[]> = signal<GestionPlazaInterface[]>([]);

  first: number = 0;
  rows: number = 10;
  totalRecords: number = 100;


  ngOnInit(): void {

    this.obtenerTipoBusquedaDesdeRuta();
    this.inicializarFormulario();
    this.cargarCatalogos();
    this.plazas.set([...this.plazasDummies]);
  }

  private obtenerTipoBusquedaDesdeRuta(): void {
     const path = this.route.snapshot.routeConfig?.path;
    if (path === NAV.gestionPlazas) {
      this.gestionPlazaService.setTipoBusqueda(TipoBusquedaPlaza.BusquedaLayout);
    } else {
      this.gestionPlazaService.setTipoBusqueda(TipoBusquedaPlaza.BusquedaManual);
    }
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
    this.ref = this.dialogService.open(CambioEstatusComponent, {
      style:{
        'border-top': '11px solid #0F9B9B',
        'border-radius': '9px'
      },
      data: {plaza, edicion: false},
      modal: true,
      width: '600px',
      height: '33vh',
      focusOnShow: false,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      styleClass: 'oferta-detail'
    });
  }



  editarEstatus(plaza: GestionPlazaInterface): void {
    this.ref = this.dialogService.open(CambioEstatusComponent, {
      style:{
        'border-top': '11px solid #0F9B9B',
        'border-radius': '9px'
      },
      data: {plaza, edicion: true},
      modal: true,
      width: '600px',
      height: '33vh',
      focusOnShow: false,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      styleClass: 'oferta-detail'
    });
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


  accionPlazaSeleccionada(plaza: PlazaAccion){

    switch (plaza.accion) {
      case AccionPlaza.VerDetalle:
        this.verDetalle(plaza.plaza );
        break;
      case AccionPlaza.EditarEstatus:
        this.editarEstatus(plaza.plaza );
        break;
      case AccionPlaza.EditarPlaza:
        this.editar(plaza.plaza );
        break;
      case AccionPlaza.EliminarPlaza:
        this.eliminar(plaza.plaza );
        break;
      default:
        break;
    }

  }
}

