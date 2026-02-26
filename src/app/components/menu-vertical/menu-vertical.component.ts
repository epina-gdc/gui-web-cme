import {Component, inject, OnInit} from '@angular/core';
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from 'primeng/accordion';
import {SesionUser} from '@models/sesion-user.interface';
import {UserService} from '@services/user.service';
import {NavigationEnd, Router, RouterLink, RouterLinkActive} from '@angular/router';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'menu-vertical',
  imports: [
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionPanel,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './menu-vertical.component.html',
  styleUrl: './menu-vertical.component.scss'
})
export class MenuVerticalComponent implements OnInit {
  userData: SesionUser | null = null;

  userService = inject(UserService);
  private router = inject(Router);

  activePanelId: number | null = null;

  ngOnInit() {
    this.userService.userData$.subscribe(user => {
      this.userData = user;
      this.updateActivePanel();
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateActivePanel();
    });
  }

  private updateActivePanel() {
    const currentUrl = this.router.url;
    if (!this.userData?.modulos) return;
    for (const modulo of this.userData.modulos) {
      // La ruta coincide con el padre (módulo sin hijos)
      if (currentUrl.includes(modulo.ruta)) {
        this.activePanelId = modulo.idModuloMenu;
        return;
      }

      // La ruta coincide con algún hijo (submódulos)
      const tieneHijoActivo = modulo.submodulos?.some(sub => currentUrl.includes(sub.ruta));

      if (tieneHijoActivo) {
        this.activePanelId = modulo.idModuloMenu; // Se mantiene el ID del padre activo
        return;
      }
    }
  }

  handleHeaderClick(event: MouseEvent, modulo: any) {
    const estaActivo: boolean = this.activePanelId === modulo.idModuloMenu;

    if (estaActivo) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }

    if (!modulo.submodulos || modulo.submodulos.length === 0) {
      event.stopPropagation();
      this.activePanelId = modulo.idModuloMenu;
      void this.router.navigate(['/privado' + modulo.ruta]);
    } else {
      this.activePanelId = modulo.idModuloMenu;
    }
  }


}
