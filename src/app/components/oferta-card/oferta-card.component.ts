import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Card} from 'primeng/card';
import {Rating} from 'primeng/rating';
import {FormsModule} from '@angular/forms';
import {Badge} from 'primeng/badge';
import { OportunidadLaboral } from '@models/oportunidad-laboral.interface';

@Component({
  selector: 'oferta-card',
  imports: [
    Card,
    Rating,
    FormsModule,
    Badge
  ],
  templateUrl: './oferta-card.component.html',
  styleUrl: './oferta-card.component.scss'
})
export class OfertaCardComponent {
  value: any;

  @Output() abrirDetalleEvent =  new EventEmitter<OportunidadLaboral>();
  @Input() detalleOportunidad: OportunidadLaboral =
  {
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
    descuentoQuincenalCreditoHipotecario: null,
  };

  verMas(): void {
    this.abrirDetalleEvent.emit(this.detalleOportunidad);
  }
}
