import {Component, OnInit, inject} from '@angular/core';
import {Avatar} from 'primeng/avatar';
import { GeneralComponent } from '../general.component';
import { SesionUser } from '@models/sesion-user.interface';
import { UserService } from '@services/user.service';

@Component({
  selector: 'app-menu',
  imports: [
    Avatar
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent extends GeneralComponent implements OnInit{

  userService = inject(UserService);
  userData: SesionUser | null = null;
  

  ngOnInit(){
    this.userService.userData$.subscribe(user => this.userData = user);
  }
}
