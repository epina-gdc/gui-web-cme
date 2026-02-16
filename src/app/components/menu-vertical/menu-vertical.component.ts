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
    this.userService.userData$.subscribe(user => this.userData = user);
    this.updateActivePanel();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => this.updateActivePanel());
  }

  private updateActivePanel() {
    const currentUrl = this.router.url;
    // Se busca el módulo cuya ruta coincida con la URL actual
    const activeModule = this.userData?.modulos.find(m => currentUrl.includes(m.ruta));
    if (activeModule) {
      this.activePanelId = activeModule.idModuloMenu;
    }
  }

  handleHeaderClick(event: MouseEvent, modulo: any) {
    const estaActivo: boolean = this.activePanelId === modulo.idModuloMenu;

    if (estaActivo) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }

    if (modulo.submodulos.length === 0) {
      event.stopPropagation();
      void this.router.navigate(['/privado' + modulo.ruta]);
      this.activePanelId = modulo.idModuloMenu;
    }
  }
}
