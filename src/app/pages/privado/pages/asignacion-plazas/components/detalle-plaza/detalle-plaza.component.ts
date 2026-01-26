import {Component, OnInit} from '@angular/core';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import {SplitByWidthDirective} from '@directives/split-by-width.directive';
import {Card} from 'primeng/card';
import {CurrencyPipe} from '@angular/common';
import {Rating} from 'primeng/rating';
import {TooltipModule} from 'primeng/tooltip';
import {EstadoOfertaService} from '@services/estado-oferta.service';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-detalle-plaza',
  imports: [
    SplitByWidthDirective,
    CurrencyPipe,
    Card,
    TooltipModule,
    Button
  ],
  templateUrl: './detalle-plaza.component.html',
  styleUrl: './detalle-plaza.component.scss',
  providers: [CurrencyPipe]
})
export class DetallePlazaComponent implements OnInit{

  plazaSeleccionada: any;

  constructor(
    private readonly config: DynamicDialogConfig,
    private readonly currencyPipe: CurrencyPipe,
    private readonly estadoOfertaService: EstadoOfertaService,
  ){

  }

  ngOnInit(){
    if (this.config?.data) {
    this.plazaSeleccionada = this.config.data;
    }

    const nuevoEstado = {
      titulo: "Cardiología",
      subTitulo: "Medicina familiar",
      badgeValue: true,
    };
    this.estadoOfertaService.actualizarEstado(nuevoEstado);
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
}
