import {Component, HostListener, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MenuComponent} from '@components/menu/menu.component';
import {InactividadDialogComponent} from '@components/inactividad-dialog/inactividad-dialog.component';
import {UserService} from '@services/user.service';
import {SesionUser} from '@models/sesion-user.interface';
import {MenuVerticalComponent} from '@components/menu-vertical/menu-vertical.component';

@Component({
  selector: 'app-privado',
  imports: [
    RouterOutlet,
    MenuComponent,
    InactividadDialogComponent,
    MenuVerticalComponent
  ],
  templateUrl: './privado.component.html',
  styleUrl: './privado.component.scss'
})
export class PrivadoComponent implements OnInit {
  userData: SesionUser | null = null;

  userService = inject(UserService);

  menuVisible = false;
  isScrolled = false;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkResolution();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const offset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = offset > 30;
  }

  checkResolution() {
    if (window.innerWidth < 1025) {
      this.menuVisible = false;
    }
  }

  ngOnInit() {
    this.userService.userData$.subscribe(user => this.userData = user);
  }

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }
}
