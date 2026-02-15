import {Component, inject, OnInit} from '@angular/core';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import {SplitByWidthDirective} from '@directives/split-by-width.directive';
import {Card} from 'primeng/card';
import {CurrencyPipe} from '@angular/common';
import {TooltipModule} from 'primeng/tooltip';
import {EstadoOfertaService} from '@services/estado-oferta.service';
import {Button} from 'primeng/button';
import { AsignacionRequest, Plaza } from '@models/datosAsignacion';
import { AlertService } from '@services/alert.service';
import { AsignacionPlazaService } from '@services/asignacion-plaza.service';

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

  data: {
    plaza: Plaza,
    idUsuario: number,
    tipoAsignacion: number
  } = {plaza: new Plaza(), idUsuario: 0, tipoAsignacion: 0};
  plazaSeleccionada: Plaza = new Plaza();
  alertaService: AlertService = inject(AlertService);
  asignacionPlazaService: AsignacionPlazaService = inject(AsignacionPlazaService);


  constructor(
    private readonly config: DynamicDialogConfig,
    private readonly currencyPipe: CurrencyPipe,
    private readonly estadoPlazaService: EstadoOfertaService,
  ){

  }

  ngOnInit(){
    if (this.config?.data) {
        this.data = this.config.data;
        this.plazaSeleccionada = this.config.data.plaza;
    }
    const nuevoEstado = {
      titulo: this.data.plaza.especialidad ?? '',
      subTitulo: this.data.plaza.categoria ?? '',
      badgeValue: this.data.plaza.nuevoHospital == 1 ? true : false,
    };
    this.estadoPlazaService.actualizarEstado(nuevoEstado);
  }

  asignar(){
    let request: AsignacionRequest = {
          idUsuario: this.data.idUsuario,
          idTipoAsignacionPlaza: this.data.tipoAsignacion,
          idPlaza: this.data.plaza.idPlaza,
        }
        console.log(request);
        this.asignacionPlazaService.asignarPlaza(request).subscribe({
          next: (response) => {
            console.log('Result ', response);
            if (response.exito) {
              this.alertaService.exito('Felicidades se asignó con éxito la plaza No.<strong>' + this.data.plaza.numPlaza +'<strong>');
              this.estadoPlazaService.notificarRefreshPlazas();
            } else {
              this.alertaService.error(response.mensaje);
              return;
            }
          },
          error: (error) => {
            //console.log(error);
            this.alertaService.error('Ocurrió un error al registrar la asignación.');
            return;
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

}
