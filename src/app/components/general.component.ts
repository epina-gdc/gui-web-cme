import {CommonModule} from "@angular/common";
import {Component, inject} from "@angular/core";
import {Mensajes} from "@utils/mensajes";
import {Router} from '@angular/router';
import {NAV} from "./../core/utils/url-global";
import {CatalogoGeneral} from "@models/catalogoGeneral";
import {AlertService} from "../core/alert/alert.service";


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
  protected _alertServices: AlertService;



  constructor() {
    this._Mensajes = inject(Mensajes);
    this._router = inject(Router);
    this._alertServices = inject(AlertService);
  }




  salir() {

  }




  irAHome() {

  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  public getSession(objeto: string): any {
    let p: any;
    let encodeJson = sessionStorage.getItem(objeto);

    if (encodeJson) {
      p = JSON.parse(decodeURIComponent(window.atob(encodeJson)));
    }
    return p;
  }


  public saveSession(objeto: string, data: any) {
    sessionStorage.setItem(objeto, window.btoa(encodeURIComponent(JSON.stringify(data))));
  }

  public removeSession(objeto: string) {
    sessionStorage.removeItem(objeto);
  }


  public getCatalogoModalidad():Array<CatalogoGeneral> {
    let lstModalidad:Array<CatalogoGeneral> = [{
      id: 1,
      descripcion: 'Médico cursando la residencia'
    },
    { id: 2, descripcion: 'Médico especialista con estudio en el extranjero ' },
    { id: 3, descripcion: 'Médicos especialistas egresados 2025 de otra Institucional de Salud' },
    { id: 4, descripcion: 'Médico especialista IMSS egresado de dos años anteriores ' }
    ]
    return lstModalidad;
  }


  getCatalogoPerfiles() :Array<CatalogoGeneral> {
    let lstPerfil = [{
      id: 1,
      descripcion: 'Residente IMSS'
    },
    { id: 2, descripcion: 'Médico externo' }
    ]

    return lstPerfil;
  }



  getCatalogoDocumento() :Array<CatalogoGeneral> {
    let lstDocumentos = [
      { id: 1, descripcion: 'CURP' },
      { id: 2, descripcion: 'Pasaporte' },

    ]
    return lstDocumentos;
  }


  convertirMayusculas(texto:string):string{
    let mayusculas = texto.toUpperCase();
    return mayusculas;
  }

  convertirMinusculas(texto:string):string{
    let minusculas = texto.toLowerCase();
    return minusculas;
  }


  public comparaCampos(texto1: string, texto2: string): boolean {
    let blnIguales = false;
    if (texto1 === texto2) {
      blnIguales = true;
    }

    return blnIguales;
  }
}
