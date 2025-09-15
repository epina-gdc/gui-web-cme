import {Component, OnInit} from '@angular/core';
import {Card} from 'primeng/card';
import {IconCardComponent} from '../../../../components/icon-card/icon-card.component';
import {BtnRegresarComponent} from '../../../../components/btn-regresar/btn-regresar.component';
import {Steps} from 'primeng/steps';
import {MenuItem} from 'primeng/api';
import {NgClass} from '@angular/common';
import {StepsComponent} from '../../../../components/steps/steps.component';

@Component({
  selector: 'app-inicio',
  imports: [
    Card,
    IconCardComponent,
    BtnRegresarComponent,
    Steps,
    NgClass,
    StepsComponent
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit {
  items: MenuItem[] | undefined;
  active: number = 1;

  ngOnInit() {
    this.items = [
      {
        label: 'Personal',
      },
      {
        label: 'Seat',
      },
      {
        label: 'Payment',
      },
      {
        label: 'Confirmation',
      }
    ];
  }
}
