import {Component, HostListener, inject, OnInit} from '@angular/core';
import {Avatar} from 'primeng/avatar';
import {GeneralComponent} from '../general.component';
import {SesionUser} from '@models/sesion-user.interface';
import {UserService} from '@services/user.service';
import {SpeedDial} from 'primeng/speeddial';
import {MenuItem, PrimeTemplate} from 'primeng/api';

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

  speedDialVisible: boolean = false;

  items: MenuItem[] = [];

  private readonly MOBILE_BREAKPOINT = 768;

  isMobileView: boolean = false;

  ngOnInit() {
    this.checkScreenSize();
    this.items = [
      {
        label: 'Cerrar sesión',
        icon: 'pi pi-sign-out',
        command: (event: any) => {
          this.cerrarSesion(event)
        },
      }
    ]
    this.userService.userData$.subscribe(user => this.userData = user);
  }


  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isMobileView = window.innerWidth < this.MOBILE_BREAKPOINT;
  }


  cerrarSesion(event: any) {
    if (!event) return;
    this.authService.cerrarSesion();
  }

}
