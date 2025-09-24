import { Component } from '@angular/core';
import {HeaderTabComponent} from '../header-tab/header-tab.component';
import {Button} from 'primeng/button';
import {TableModule} from 'primeng/table';

@Component({
  selector: 'empty-tab',
  imports: [
    HeaderTabComponent,
    Button,
    TableModule
  ],
  templateUrl: './empty-tab.component.html',
  styleUrl: './empty-tab.component.scss'
})
export class EmptyTabComponent {
  valoresVacios: string[] = [];

}
