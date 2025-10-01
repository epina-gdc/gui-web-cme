import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms"; // Import FormsModule
import {Card} from 'primeng/card';
import {Button} from 'primeng/button';
import {Select} from 'primeng/select';
import {RadioButton, RadioButtonModule} from 'primeng/radiobutton';
import {GeneralComponent} from '../../../../components/general.component';
import {CommonModule} from '@angular/common';
import {RegistroMedico} from '@models/datosMedico';
import {
  CatDocumentoVerificacion,
  CatDocVerifResponse,
  CatPerfil,
  CatPerfilResponse,
  CatSubperfil,
  CatSubperfilResponse
} from '@models/catalogoGeneral';

@Component({
  selector: 'app-crear-cuenta',
  imports: [
    Card,
    Button,
    Select,
    ReactiveFormsModule,
    CommonModule,
    RadioButtonModule,
    FormsModule,


    RadioButton,



  ],
  standalone: true,
  templateUrl: './crear-cuenta.component.html',
  styleUrl: './crear-cuenta.component.scss'
})
export class CrearCuentaComponent extends GeneralComponent implements OnInit {

  fb = inject(FormBuilder)
  form!: FormGroup;
  blnSeleccionado = false;

  lstPerfil !: any;
  lstModalidad!: Array<CatSubperfil>;
  lstDocumentos!: Array<CatDocumentoVerificacion>;
  registroMedico!: RegistroMedico;
  blnResidente!: boolean;

    ngOnInit() {
    this.registroMedico = new RegistroMedico();
    this.blnResidente = true;
    this.blnSeleccionado = false;
    this.form = this.inicializarForm();

     this.getCatalogoPerfiles();


      console.log("perfiles",this.lstPerfil);

//this._alertServices.exito("este texto muestra algo en <b> negritas<b/>");

  }

  getCatalogoPerfiles(): void{
    this.lstPerfil = new Array<CatPerfil>();
    this._CatalogoGenService.getLstPerfil().subscribe((response: CatPerfilResponse) => {

      if (response.exito) {

        this.lstPerfil = response.respuesta;


      }



    });
  }

  getCatalogoModalidad(): void{
    this.lstModalidad = new Array<CatSubperfil>();
    this._CatalogoGenService.getLstSubPerfil().subscribe((response: CatSubperfilResponse) => {
      if (response.exito) {
        this.lstModalidad = response.respuesta;
      }
    });
  }

  getCatalogoDocumento(): void{
    this.lstDocumentos = new Array<CatDocumentoVerificacion>();
    this._CatalogoGenService.getLstDocumentosVerificacion().subscribe((response: CatDocVerifResponse) => {
      if (response.exito) {
        this.lstDocumentos = response.respuesta;
      }
    });
  }


  inicializarForm(): FormGroup {
    return this.fb.group({
      perfil: ['', [Validators.required]],
      modalidad: ['', ''],
      documento: ['', ''],

    });
  }




  public btnAceptar() {


    if (this.form.valid) {


      switch (this.registroMedico.blnInterno) {
        case true:

          break;
        case false:
          this.registroMedico.desDocumentoVerificacion =this.form.controls['documento'].value;
          let doc = this.lstDocumentos.find(x=> x.desDocumentoVerificacion ===  this.registroMedico.desDocumentoVerificacion  );
          if(doc){
            this.registroMedico.documentoVerif = doc;
          }

          if (  this.registroMedico.desDocumentoVerificacion  === 'CURP') {
            this.registroMedico.blnPasaporte = false;
          }
           if (  this.registroMedico.desDocumentoVerificacion  === 'PASAPORTE') {
            this.registroMedico.blnPasaporte = true;
          }





          this._router.navigate(['publico/' + this._nav.registroMedico]);

          break;


        default:
          break;
      }
      console.log("registroMedico es ", this.registroMedico);
      this.saveSession("registroMedico", this.registroMedico)
      this._router.navigate(['publico/' + this._nav.registroMedico]);
    } else {

    }
  }



  cambiaPerfil() {

    console.log("hay cambios en el selct ");

    this.perfilSeleccionado();

    if ( !this.registroMedico.blnInterno) {

      this.camposExterno();



    }else{
      this.camposResidente();



    }
  }

  perfilSeleccionado(){
    this.registroMedico.perfil1 = this.form.controls['perfil'].value;
    let perfil = this.lstPerfil.find((x: { idPerfil: number; })=> x.idPerfil ==  this.registroMedico.perfil1);
    if(perfil){
      this.registroMedico.perfil = perfil;
      if (perfil.nomPerfil.toLowerCase().trim() === 'médico externo') {
        this.registroMedico.blnInterno = false;
      }else{
        this.registroMedico.blnInterno = true;
      }
    }
  }

  private camposResidente() {
    this.clearCampos();
    this.blnResidente = true;
  }
  private camposExterno() {
    this.getCatalogoModalidad();
    this.getCatalogoDocumento();
    this.blnResidente = false;



    this.form.controls['modalidad'].setValidators([Validators.required]);
    this.form.controls['documento'].setValidators([Validators.required]);
    this.form.controls['modalidad'].updateValueAndValidity();
    this.form.controls['documento'].updateValueAndValidity();
  }

  private clearCampos(){
    this.form.controls['modalidad'].setValue(null);
    this.form.controls['modalidad'].setValidators([]);
    this.form.controls['documento'].setValidators([]);
    this.form.controls['modalidad'].updateValueAndValidity();
    this.form.controls['documento'].updateValueAndValidity();
  }

  cambiaModalidad() {

    this.registroMedico.modalidad = this.form.controls['modalidad'].value;
    console.log("hay cambios en el selct ", this.registroMedico);
  }
}
