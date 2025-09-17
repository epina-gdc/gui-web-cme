import { CommonModule } from "@angular/common";
import { Component, OnDestroy, inject } from "@angular/core";
import { Mensajes } from "../components/mensajes";
import { Router } from '@angular/router';
import { NAV } from "./url-global";


@Component({
  selector: 'app-general',
  //standalone: true,
  imports: [
    CommonModule,
  ],
  template: '',
})
export class GeneralComponent  {

  _nav = NAV;
  protected _Mensajes: Mensajes;
  protected _router: Router;



  
  constructor() {
    this._Mensajes = inject(Mensajes);
    this._router = inject(Router);
  }
 
  


  salir() {
  
  }




  irAHome() {
   
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }



 


}
