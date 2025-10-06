import {Component, inject, OnInit} from '@angular/core';
import {IconCardComponent} from "../../../../components/icon-card/icon-card.component";
import {UserService} from '@services/user.service';
import {SesionUser} from '@models/sesion-user.interface';
import {AuthService} from '@services/auth.service';

@Component({
  selector: 'header-medico-interno',
  imports: [
    IconCardComponent
  ],
  templateUrl: './header-medico-interno.component.html',
  styleUrl: './header-medico-interno.component.scss'
})
export class HeaderMedicoInternoComponent implements OnInit {
  authService = inject(AuthService);
  userData: SesionUser | null = null;
  
  //TODO: Verificar si la variable la devuelve back o se toma de la hora actual
  fechaActual = new Date();

  ngOnInit() {
    this.userData = this.authService.usuarioSesion;
  }

}
