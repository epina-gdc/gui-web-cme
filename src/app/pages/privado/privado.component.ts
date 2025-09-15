import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MenuComponent} from '../../components/menu/menu.component';

@Component({
  selector: 'app-privado',
  imports: [
    RouterOutlet,
    MenuComponent
  ],
  templateUrl: './privado.component.html',
  styleUrl: './privado.component.scss'
})
export class PrivadoComponent {

}
