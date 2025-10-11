import { Component } from '@angular/core';
import {Card} from "primeng/card";
import {Rating} from 'primeng/rating';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs';
import {SplitByWidthDirective} from '@directives/split-by-width.directive';

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
    SplitByWidthDirective
  ],
  templateUrl: './detalle-oferta-laboral.component.html',
  styleUrl: './detalle-oferta-laboral.component.scss'
})
export class DetalleOfertaLaboralComponent {
  value: any;

}
