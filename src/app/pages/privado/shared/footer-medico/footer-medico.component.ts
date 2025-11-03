import {Component, inject} from '@angular/core';
import {AuthService} from '@services/auth.service';

@Component({
  selector: 'app-footer-medico',
  imports: [],
  templateUrl: './footer-medico.component.html',
  styleUrl: './footer-medico.component.scss'
})
export class FooterMedicoComponent {
    authService: AuthService = inject(AuthService);

    sesion = this.authService.usuarioSesion;

}
