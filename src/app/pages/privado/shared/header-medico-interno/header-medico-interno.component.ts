import {Component, inject, OnInit} from '@angular/core';
import {IconCardComponent} from "../../../../components/icon-card/icon-card.component";
import {UserService} from '@services/user.service';
import {SesionUser} from '@models/sesion-user.interface';

@Component({
  selector: 'header-medico-interno',
  imports: [
    IconCardComponent
  ],
  templateUrl: './header-medico-interno.component.html',
  styleUrl: './header-medico-interno.component.scss'
})
export class HeaderMedicoInternoComponent implements OnInit {
  userService = inject(UserService);
  userData: SesionUser | null = null;


  ngOnInit(){
    this.userService.userData$.subscribe(user => this.userData = user);
  }

}
