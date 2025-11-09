import {Component, OnInit, inject} from '@angular/core';
import {Card} from "primeng/card";
import {Rating} from 'primeng/rating';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs';
import {SplitByWidthDirective} from '@directives/split-by-width.directive';
import {Image} from 'primeng/image';
import {Carousel} from 'primeng/carousel';
import {EstadoOfertaService} from '@services/estado-oferta.service';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import {OportunidadLaboral} from '@models/oportunidad-laboral.interface';
import {CommonModule, CurrencyPipe} from '@angular/common';
import {TooltipModule} from 'primeng/tooltip';
import {GeneralComponent} from '@components/general.component';
import {UserService} from '@services/user.service';
import {SesionUser} from '@models/sesion-user.interface';

@Component({
  selector: 'app-detalle-oferta-laboral',
  imports: [
    Card,
    Rating,
    FormsModule,
    Button,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    SplitByWidthDirective,
    Image,
    Carousel,
    CommonModule,
    TooltipModule
  ],
  templateUrl: './detalle-oferta-laboral.component.html',
  styleUrl: './detalle-oferta-laboral.component.scss',
  providers: [CurrencyPipe]
})
export class DetalleOfertaLaboralComponent extends GeneralComponent implements OnInit {
  valorFavoritos: number = 0;

  userService = inject(UserService);
  userData: SesionUser | null = null;

  ofertaSeleccionada: OportunidadLaboral =
    {
      esFavorita: false,
      idPlaza: 0,
      cveOoad: null,
      cvePuesto: null,
      cveUnidad: null,
      porcAltoCostoVida: null,
      especialidad: null,
      categoria: null,
      regimen: null,
      turno: null,
      tipoPlaza: null,
      marcaOcupacion: null,
      umf: null,
      nuevoHospital: null,
      ubicacion: null,
      zona: null,
      direccion: null,
      sueldoMensualBruto: null,
      sueldoMensualNeto: null,
      horario: null,
      numPlaza: null,
      clasificacion: null,
      ooad: null,
      creditos: null,
      bonoDificilCobertura: null,
      accesoCredito: null,
      creditoAutomotriz: null,
      descuentoQuincenalCreditoAutomotriz: null,
      creditoHipotecario: null,
      descuentoQuincenalCreditoHipotecario: null
    };

  tooltipOptions = {
    showDelay: 150,
    autoHide: false,
    tooltipEvent: 'hover',
    tooltipPosition: 'left'
  }

  constructor(private readonly estadoOfertaService: EstadoOfertaService,
              private config: DynamicDialogConfig,
              private currencyPipe: CurrencyPipe
  ) {
    super();
  }

  ngOnInit() {
    this.userService.userData$.subscribe(user => this.userData = user);
    if (this.config?.data) {
      this.ofertaSeleccionada = this.config.data.oportunidad;
    }
    const nuevoEstado = {
      titulo: this.ofertaSeleccionada.especialidad,
      subTitulo: this.ofertaSeleccionada.categoria,
      badgeValue: this.ofertaSeleccionada.nuevoHospital === 1,
    };
    this.estadoOfertaService.actualizarEstado(nuevoEstado);
    this.value = this.ofertaSeleccionada.esFavorita ? 1 : 0;
  }


  value: any;
  products: any[] = [{
    id: '1000',
    code: 'f230fh0g3',
    name: 'Bamboo Watch',
    description: 'Product Description',
    image: 'bamboo-watch.jpg',
    price: 65,
    category: 'Accessories',
    quantity: 24,
    inventoryStatus: 'INSTOCK',
    rating: 5
  },
    {
      id: '1001',
      code: 'nvklal433',
      name: 'Black Watch',
      description: 'Product Description',
      image: 'black-watch.jpg',
      price: 72,
      category: 'Accessories',
      quantity: 61,
      inventoryStatus: 'OUTOFSTOCK',
      rating: 4
    },
    {
      id: '1002',
      code: 'zz21cz3c1',
      name: 'Blue Band',
      description: 'Product Description',
      image: 'blue-band.jpg',
      price: 79,
      category: 'Fitness',
      quantity: 2,
      inventoryStatus: 'LOWSTOCK',
      rating: 3
    }];

  cambioDatosHeader(step: number): void {
    const titulo: string = step === 2 ? 'Sedes' : step === 1 ? 'Baja California' : 'Cardiología';
    const nuevoEstado = {
      titulo,
      subTitulo: 'Medicina Familiar',
      badgeValue: step === 0,
    };
    this.estadoOfertaService.actualizarEstado(nuevoEstado);
  }

  agregarFavorito() {
    this._ConvocatoriaService.agregarFavorito(
      {
        idUsuario: this.userData!.idUsuario,
        idPlaza: this.ofertaSeleccionada.idPlaza,
        esFavorita: true
      }
    ).subscribe({
      next: (respuesta) => {
        this._alertServices.alerta("Exito");
        this.ofertaSeleccionada.esFavorita = true;
        this.value = 1;
        this.obtenerTotalFavoritos()
      }
    });
  }

  eliminarFavorito() {
    this._ConvocatoriaService.agregarFavorito(
      {
        idUsuario: this.userData!.idUsuario,
        idPlaza: this.ofertaSeleccionada.idPlaza,
        esFavorita: false
      }
    ).subscribe({
      next: (respuesta) => {
        this._alertServices.alerta("Exito");
        this.value = 0;
        this.ofertaSeleccionada.esFavorita = false;
        this.obtenerTotalFavoritos();
      }
    });
  }


  infoTexto(credito: any) {
    const creditoFormateado = this.currencyPipe.transform(
      credito,
      'USD',
      'symbol',
      '1.2-2',
      'en-US'
    ) ?? '';
    return `El importe máximo del descuento quincenal es de hasta ${creditoFormateado} pesos`
  }

  obtenerTotalFavoritos(): void {
    const solicitud = this.generarSolicitudFiltrosFavoritosTotales();
    this._ConvocatoriaService.consultarTotalesFavoritos({...solicitud}).subscribe({
      next: (respuesta: any) => {
        this.estadoOfertaService.actualizarFavoritos(respuesta.respuesta.totalFavoritas);
      }
    })
  }


  generarSolicitudFiltrosFavoritosTotales() {
    return {
      cveEspecialidad: null,
      cveOoad: null,
      cveBono: null,
      cveRegimen: null,
      cveZona: null,
      idUsuario: this.userData?.idUsuario as number
    }
  }
}
