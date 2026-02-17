import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Card} from 'primeng/card';
import {Badge} from 'primeng/badge';
import {CurrencyPipe, TitleCasePipe} from '@angular/common';
import {OportunidadLaboral} from '@models/oportunidad-laboral.interface';
import { Plaza, TipoAsignacion } from '@models/datosAsignacion';
import {OnCloseOnNavigationDirective} from '@directives/close-on-navigation.directive';


@Component({
  selector: 'app-plaza-disponible-card',
  imports: [
    Card,
    Badge,
    TitleCasePipe,

    CurrencyPipe,
    OnCloseOnNavigationDirective
  ],
  templateUrl: './plaza-disponible-card.component.html',
  styleUrl: './plaza-disponible-card.component.scss',
  providers: [CurrencyPipe]
})
export class PlazaDisponibleCardComponent implements OnInit{
  private readonly MOBILE_BREAKPOINT = 768;

  isMobileView: boolean = false;

  @Input() plaza: Plaza = new Plaza();
  @Input() idUsuario!: number;
  @Input() tipoAsignacion!: number;
  @Output() abrirDetalleEvent = new EventEmitter<{plaza: Plaza; idUsuario: number; tipoAsignacion: number}>();

  constructor(private readonly currencyPipe: CurrencyPipe) {

    this.checkScreenSize();
  }


  private checkScreenSize(): void {
    this.isMobileView = window.innerWidth < this.MOBILE_BREAKPOINT;
  }

  ngOnInit() {
  }

  verMas(){
    this.abrirDetalleEvent.emit({plaza: this.plaza, idUsuario: this.idUsuario, tipoAsignacion: this.tipoAsignacion});
  }
}
