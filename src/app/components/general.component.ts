import { CommonModule } from "@angular/common";
import { Component, OnDestroy, inject } from "@angular/core";
import { Mensajes } from "../components/mensajes";



@Component({
  selector: 'app-general',
  //standalone: true,
  imports: [
    CommonModule,
  ],
  template: '',
})
export class GeneralComponent  {


  protected _Mensajes: Mensajes;



  public msjCamposObligatorios = 'Ingrese los campos obligatorios';
  constructor() {
    this._Mensajes = inject(Mensajes);
  }
 
  


  salir() {
  
  }




  irAHome() {
   
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }



 


}
