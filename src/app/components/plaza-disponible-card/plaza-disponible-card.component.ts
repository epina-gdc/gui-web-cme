import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Card} from 'primeng/card';
import {Badge} from 'primeng/badge';
import {CurrencyPipe, TitleCasePipe} from '@angular/common';
import {OportunidadLaboral} from '@models/oportunidad-laboral.interface';


@Component({
  selector: 'app-plaza-disponible-card',
  imports: [
    Card,
    Badge,
    TitleCasePipe,

    CurrencyPipe,

  ],
  templateUrl: './plaza-disponible-card.component.html',
  styleUrl: './plaza-disponible-card.component.scss',
  providers: [CurrencyPipe]
})
export class PlazaDisponibleCardComponent implements OnInit{
  private readonly MOBILE_BREAKPOINT = 768;

  isMobileView: boolean = false;

  @Input() plaza: any = [];
  @Output() abrirDetalleEvent = new EventEmitter<OportunidadLaboral>();

  constructor(private readonly currencyPipe: CurrencyPipe) {

    this.checkScreenSize();
  }


  private checkScreenSize(): void {
    this.isMobileView = window.innerWidth < this.MOBILE_BREAKPOINT;
  }

  ngOnInit() {



  }


  verMas(){
    this.abrirDetalleEvent.emit(this.plaza);
  }
}
