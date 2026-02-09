import {Component, HostListener, inject, OnDestroy, OnInit} from '@angular/core';
import {Avatar} from 'primeng/avatar';
import {GeneralComponent} from '../general.component';
import {SesionUser} from '@models/sesion-user.interface';
import {UserService} from '@services/user.service';
import {SpeedDial} from 'primeng/speeddial';
import {MenuItem, PrimeTemplate} from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {ClickService} from '@services/click.service';
import {EstadoOfertaService} from '@services/estado-oferta.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-menu',
  imports: [
    Avatar,
    SpeedDial,
    PrimeTemplate,
    ButtonModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent extends GeneralComponent implements OnInit, OnDestroy {

  clickService = inject(ClickService);
  userService = inject(UserService);
  estadoOfertaService = inject(EstadoOfertaService);
  userData: SesionUser | null = null;

  speedDialVisible: boolean = false;

  items: MenuItem[] = [];

  private readonly MOBILE_BREAKPOINT = 768;

  isMobileView: boolean = false;

  indice: number = 0;

  private tabSubscription: Subscription = new Subscription();

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
    this.tabSubscription = this.estadoOfertaService.tabActual$.subscribe(indice => {
      this.indice = indice
    });
  }

  ngOnDestroy() {
    this.tabSubscription.unsubscribe();
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

  emitirClick() {
    this.clickService.emitirClick();
  }

}
