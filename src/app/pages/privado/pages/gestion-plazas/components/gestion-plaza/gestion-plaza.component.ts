import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Card } from 'primeng/card';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { PaginatorState } from 'primeng/paginator';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { GeneralComponent } from '@components/general.component';
import { TipoDropdown } from '@models/tipo-dropdown.interface';
import { GestionPlazaInterface, TipoBusquedaPlaza, AccionPlaza } from '@models/gestion-plaza.interface';
import { mapearArregloTipoDropdown } from '@utils/funciones';
import { Mensajes } from '@utils/mensajes';
import { GestionPlazaEstadoService } from '@services/gestion-plaza-estado.service';
import { TablaPlazasComponent } from '../tabla-plazas/tabla-plazas.component';
import { OnlyNumbersDirective } from '@directives/only-numbers.directive';
import { AlertService } from '@services/alert.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CambioEstatusComponent } from '../cambio-estatus/cambio-estatus.component';
import { ActivatedRoute } from '@angular/router';
import { NAV } from '@utils/url-global';
import { GestionPlazaService } from '@services/gestion-plaza.service';
import { ConvocatoriaActiva } from '@models/convocatoria.interface';

interface PlazaAccion {
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
    ConfirmDialog,
    TablaPlazasComponent,
    OnlyNumbersDirective
  ],
  templateUrl: './gestion-plaza.component.html',
  styleUrl: './gestion-plaza.component.scss',
  providers: [DialogService, ConfirmationService]
})
export class GestionPlazaComponent extends GeneralComponent implements OnInit {
  readonly TipoBusquedaPlaza = TipoBusquedaPlaza;

  formBusqueda!: FormGroup;
  fb: FormBuilder = inject(FormBuilder);
  mensajes = inject(Mensajes);
  alertaService: AlertService = inject(AlertService);
  confirmationService: ConfirmationService = inject(ConfirmationService);
  gestionEstadoPlazaService = inject(GestionPlazaEstadoService);
  gestionPLazaService: GestionPlazaService = inject(GestionPlazaService);
  dialogService = inject(DialogService);
  private route = inject(ActivatedRoute);

  ref: DynamicDialogRef | undefined;

  lstOoad: TipoDropdown[] = [];
  lstEstatusPlaza: TipoDropdown[] = [];


  plazas: WritableSignal<GestionPlazaInterface[]> = signal<GestionPlazaInterface[]>([]);
  convocatoriaActiva!: ConvocatoriaActiva;

  first: number = 0;
  rows: number = 10;
  numPaginaActual: number = 0;
  totalRecords: number = 0;


  ngOnInit(): void {
    this.obtenerTipoBusquedaDesdeRuta();
    this.inicializarFormulario();
    this.cargarCatalogos();
  }

  private obtenerTipoBusquedaDesdeRuta(): void {
    const path = this.route.snapshot.routeConfig?.path;
    this.plazas.set([])
    if (path === NAV.gestionPlazas) {
      this.gestionEstadoPlazaService.setTipoBusqueda(TipoBusquedaPlaza.BusquedaLayout);
    } else {
      this.gestionEstadoPlazaService.setTipoBusqueda(TipoBusquedaPlaza.BusquedaManual);
    }
  }

  inicializarFormulario(): void {
    this.formBusqueda = this.fb.group({
      cveOoad: [null, [Validators.required]],
      numPlaza: ['']
    });
  }

  cargarCatalogos(): void {
    this._CatalogoGenService.getLstOOADS().subscribe({
      next: (response) => {
        if (response?.respuesta && response.respuesta.length > 0) {
          this.lstOoad = mapearArregloTipoDropdown(response.respuesta, 'desOoad', 'cveOoad');
        }
      },
      error: (err) => {
        console.error('Error al consultar catálogo de OOAD:', err);
      }
    });

    this._CatalogoGenService.getConvocatoriaActiva().subscribe({
      next: (response) => {
        if (response?.respuesta) {
          this.convocatoriaActiva = response.respuesta;
          if (this.gestionEstadoPlazaService.tipoBusqueda() === TipoBusquedaPlaza.BusquedaManual) {
            this.onBuscar();
          }
        }
      },
      error: (err) => {
        console.error('Error al consultar convocatoria activa:', err);
      }
    });

    this._CatalogoGenService.getLstEstatusPlaza().subscribe({
      next: (response) => {
        if (response?.respuesta) {
          if (response?.respuesta && response.respuesta.length > 0) {
            this.lstEstatusPlaza = mapearArregloTipoDropdown(response.respuesta, 'descEstatusPlaza', 'idEstatusPlaza');
          }
        }
      },
      error: (err) => {
        console.error('Error al consultar convocatoria activa:', err);
      }
    });




  }

  onBuscar(): void {
    const esBusquedaLayout = this.gestionEstadoPlazaService.tipoBusqueda() === TipoBusquedaPlaza.BusquedaLayout;


    if (esBusquedaLayout && this.formBusqueda.invalid) {
      this.formBusqueda.markAllAsTouched();
      return;
    }
    const { cveOoad, numPlaza } = this.formBusqueda.value;

    const objBusqueda = {
      idConvocatoria: this.convocatoriaActiva.idConvocatoria,
      cveOoad: esBusquedaLayout ? cveOoad : null,
      numPlaza: esBusquedaLayout ? numPlaza : null,
      origenPlaza: esBusquedaLayout ? 'LAYOUT' : 'MANUAL',
      page: this.numPaginaActual,
      size: this.rows
    }

    this.gestionPLazaService.consultarPlazaLayout(objBusqueda).subscribe({
      next: resp => {
        if (resp.respuesta.content.length != 0) {
          this.plazas.set(resp.respuesta.content);
          this.totalRecords = resp.respuesta.page.totalElements;
        } else {
          this.plazas.set([]);
          this.totalRecords = 0;
          this.alertaService.error(this.mensajes.MSG024);
        }
      },
      error: err => {
        this.plazas.set([]);
        this.totalRecords = 0;
        this.alertaService.error(this.mensajes.MSG024);
      }
    })
  }

  onLimpiar(): void {
    this.formBusqueda.reset();
    //this.plazas.set([]);
    this.first = 0;
  }

  onPageChange(event: any): void {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
    this.numPaginaActual = event.page;
    this.onBuscar();
  }

  verDetalle(plaza: GestionPlazaInterface, edicion: boolean): void {
    this.ref = this.dialogService.open(CambioEstatusComponent, {
      style: {
        'border-top': '11px solid #0F9B9B',
        'border-radius': '9px'
      },
      data: { plaza, edicion, lstEstatusPlaza: this.lstEstatusPlaza },
      modal: true,
      width: '600px',
      height: '37vh',
      focusOnShow: false,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      styleClass: 'modal-cambio-estatus',
      closable: true
    });

    this.ref.onClose.subscribe((resultado) => {
      if (resultado) {
        this.onBuscar();
      }
    });
  }


  editar(plaza: GestionPlazaInterface): void {
    this._router.navigate(['/privado/generar-plaza'], {
      queryParams: { idPlaza: plaza.idPlaza },
      state: { plaza }
    });
  }

  eliminar(plaza: any): void {
    const idPlaza = plaza.idPlaza ?? plaza.id;
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar la plaza nueva?',
      header: ' ',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'btn-modal-confirmar',
      rejectButtonStyleClass: 'btn-modal-cancelar',
      accept: () => {
        if (idPlaza != null) {
          this.gestionPLazaService.eliminarPlaza(idPlaza).subscribe({
            next: () => {
              this.alertaService.exito('Plaza eliminada correctamente');
              this.onBuscar();
            },
            error: (err) => {
              console.error('Error al eliminar la plaza:', err);
              this.alertaService.error('Error al eliminar la plaza');
            }
          });
        }
      }
    });
  }

  accionPlazaSeleccionada(plaza: PlazaAccion) {

    switch (plaza.accion) {
      case AccionPlaza.VerDetalle:
        this.verDetalle(plaza.plaza, false);
        break;
      case AccionPlaza.EditarEstatus:
        this.verDetalle(plaza.plaza, true);
        break;
      case AccionPlaza.EditarPlaza:
        this.editar(plaza.plaza);
        break;
      case AccionPlaza.EliminarPlaza:
        this.eliminar(plaza.plaza);
        break;
      default:
        break;
    }

  }
}

