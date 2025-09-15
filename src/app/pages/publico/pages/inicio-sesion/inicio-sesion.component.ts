import { Component } from '@angular/core';
import {Card} from 'primeng/card';
import {Button} from 'primeng/button';
import {IconCardComponent} from '../../../../components/icon-card/icon-card.component';

@Component({
  selector: 'app-inicio-sesion',
  imports: [
    Card,
    Button,
    IconCardComponent
  ],
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.scss'
})
export class InicioSesionComponent {

}
