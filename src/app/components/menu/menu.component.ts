import {Component, inject, OnInit} from '@angular/core';
import {Avatar} from 'primeng/avatar';
import {GeneralComponent} from '../general.component';
import {SesionUser} from '@models/sesion-user.interface';
import {UserService} from '@services/user.service';
import {SpeedDial} from 'primeng/speeddial';
import {MenuItem, PrimeTemplate} from 'primeng/api';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-menu',
  imports: [
    Avatar,
    SpeedDial,
    PrimeTemplate
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent extends GeneralComponent implements OnInit {

  userService = inject(UserService);
  userData: SesionUser | null = null;
//  authService = inject(AuthService);
  items: MenuItem[] = [];


  ngOnInit() {
    this.items = [
      {
        label: 'Cerrar sesión',
        icon: 'pi pi-sign-out',
        command: () => {this.cerrarSesion()},
      }
    ]
    this.userService.userData$.subscribe(user => this.userData = user);
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
  }
}
