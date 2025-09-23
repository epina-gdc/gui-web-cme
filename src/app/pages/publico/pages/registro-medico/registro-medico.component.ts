import {Component, inject} from '@angular/core';
import {Card} from 'primeng/card';
import {GeneralComponent} from '../../../../components/general.component';

import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Select} from 'primeng/select';
import {Button} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';


import {CommonModule} from '@angular/common';
import {CatalogoGeneral} from '@models/catalogoGeneral';
import {RegistroMedico} from '@models/datosMedico';

@Component({
  selector: 'app-registro-medico',
  imports: [
    Card,
    Button,
    Select,
    InputTextModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './registro-medico.component.html',
  styleUrl: './registro-medico.component.scss'
})
export class RegistroMedicoComponent extends GeneralComponent {
  fb = inject(FormBuilder)
  form!: FormGroup;
  strTitulo!: string;
  medico!: RegistroMedico;
  lstModalidad!: Array<CatalogoGeneral>;
  ngOnInit(): void {
    this.blnPassIguales = false;
    this.blnCorreosIguales = false;
    this.lstModalidad = this.getCatalogoModalidad();
    this.form = this.inicializarForm();

    let x = this.getSession('registroMedico');
    if (x) {
      this.medico = x;
      if (this.medico.blnPasaporte) {
        this.isPasaporte();

      }
      if (this.medico.modalidad == 1) {
        this.strTitulo = 'Residente IMSS';
        this.isResidente();
      } else {
        this.strTitulo = 'Médico externo';
      }
    } else {
      this.medico = new RegistroMedico();
    }

    this.blnBtnValidar = true;
    this.medico.curp = '';

    this.form.controls['modalidad'].setValue(this.medico.modalidad);
  }

  public desbloquearValidarMatricula() {
    console.log("a desbloquear boton ");
    this.medico.matricula = this.form.controls['matricula'].value
    if (this.medico.matricula.length == 10) {
      this.blnBtnValidar = false;
    } else {
      this.blnBtnValidar = true;
    }
  }

  private clearCampos(){
    this.form.controls['matricula'].setValidators([]),
    this.form.controls['modalidad'].setValidators([]);
    this.form.controls['pasaporte'].setValidators([]);
    this.form.controls['pais'].setValidators([]);
    this.form.controls['modalidad'].updateValueAndValidity();
    this.form.controls['pasaporte'].updateValueAndValidity();
    this.form.controls['pais'].updateValueAndValidity();
    this.form.controls['matricula'].updateValueAndValidity();

  }

  private isPasaporte() {
    this.clearCampos();
    this.form.controls['modalidad'].setValidators([Validators.required]);
    this.form.controls['pasaporte'].setValidators([Validators.required]);
    this.form.controls['pais'].setValidators([Validators.required]);
    this.form.controls['modalidad'].updateValueAndValidity();
    this.form.controls['pasaporte'].updateValueAndValidity();
    this.form.controls['pais'].updateValueAndValidity();
  }

  private isResidente() {
    this.clearCampos();
    this.form.controls['matricula'].setValidators([Validators.required, Validators.minLength(10),
    Validators.minLength(10),
    Validators.maxLength(10),
    Validators.pattern(/^[0-9]{10}$/)]);


    this.form.controls['matricula'].updateValueAndValidity();

  }


  inicializarForm(): FormGroup {
    return this.fb.group({
      modalidad: ['', ''],
      matricula: ['', ''],
      pasaporte: ['', ''],
      pais: ['', ''],
      nombre: ['', [Validators.required]],
      apellidoP: ['', [Validators.required]],
      apellidoM: ['', [Validators.required]],
      curp: ['', Validators.compose([
        Validators.required,
        Validators.minLength(18),
        Validators.maxLength(18),
        Validators.pattern(/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/)

      ])],
      rfc: ['', Validators.compose([
        Validators.required,
        Validators.minLength(13),
        Validators.maxLength(13),
        // Validators.pattern(/^[0-9]{10}$/)

      ])],
      correo: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.pattern(/^[-\w.%+=_*']{1,64}@(?:[a-z0-9-]{1,63}\.){1,125}[a-z]{2,63}$/)

      ])],
      correoc: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.pattern(/^[-\w.%+=_*']{1,64}@(?:[a-z0-9-]{1,63}\.){1,125}[a-z]{2,63}$/)

      ])],
      pass: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(12),
        //Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/)
      ])],
      passc: ['', [Validators.required]],
    });
  }

  blnBtnValidar!: boolean;

  public desbloquearValidar() {
    console.log("a desbloquear boton ");
    this.medico.curp = this.form.controls['curp'].value
    if (this.medico.curp.length == 18) {
      this.blnBtnValidar = false;
    } else {
      this.blnBtnValidar = true;
    }
  }

  public btnValidar() {

    this.validarCURP();
  }

  private validarCURP() {
    this.form.controls['nombre'].setValue('Ame');
    this.form.controls['apellidoP'].setValue('Vcitoria');
    this.form.controls['apellidoM'].setValue('SArmiento');
    this.form.controls['curp'].setValue('VISA900901MTLCRM00');
    this.form.controls['rfc'].setValue('VISA900901LA3');

    this.medico.apellidoP = this.form.controls['apellidoP'].value;
    this.medico.apellidoM = this.form.controls['apellidoM'].value;
    this.medico.curp = this.form.controls['curp'].value;
    this.medico.rfc = this.form.controls['rfc'].value;

    console.log("datos del medico", this.medico);
  }

  btnAnterior() {
    this._router.navigate(['publico/' + this._nav.crearCuenta]);
  }


  public validarCorreo() {
    console.log("validando correo");
  }

  public btnCrearCuenta() {



    if (this.form.valid) {


      if (this.blnCorreosIguales) {


        if (this.blnPassIguales) {


          this.guardarRegistro();


        } else {
          this._alertServices.alerta(this._Mensajes.MSG007);
        }

      } else {
        this._alertServices.alerta(this._Mensajes.MSG0077);
      }



    } else {

      this._alertServices.alerta(this._Mensajes.MSG013);
    }
  }


  private guardarRegistro(){
    this._router.navigate(['publico/inicio-sesion']);
    setTimeout(() => {
      this._alertServices.exito(this._Mensajes.MSG012);
    }, 500);

  }
  blnCorreosIguales!: boolean;
  blnPassIguales!: boolean;
  public compararCorreos() {
    this.medico.correo = this.form.controls['correo'].value;
    this.medico.correo2 = this.form.controls['correoc'].value;
    if (this.medico.correo.length > 0 && this.medico.correo2.length > 0) {
      if (this.comparaCampos(this.medico.correo, this.medico.correo2)) {
        this.blnCorreosIguales = true;
      } else {
        this.blnCorreosIguales = false;
        this._alertServices.alerta(this._Mensajes.MSG0077);
      }
    }

  }


  public compararPassword() {
    this.medico.password = this.form.controls['pass'].value;
    this.medico.password2 = this.form.controls['passc'].value;
    if (this.medico.password.length > 0 && this.medico.password2.length > 0) {
      if (this.comparaCampos(this.medico.password, this.medico.password2)) {
        this.blnPassIguales = true;
      } else {
        this.blnPassIguales = false;
        this._alertServices.alerta(this._Mensajes.MSG007);
      }
    }

  }

  cambiaModalidad() {

    this.medico.modalidad = this.form.controls['modalidad'].value;
    console.log("hay cambios en el selct ", this.medico);
  }

  mayusculas(campo: number) {
    switch (campo) {
      case 1:
        this.medico.curp = this.convertirMayusculas(this.form.controls['curp'].value);
        this.form.controls['curp'].setValue(this.medico.curp);
        break;
      case 2://rfc
        this.medico.rfc = this.convertirMayusculas(this.form.controls['rfc'].value);
        this.form.controls['rfc'].setValue(this.medico.rfc);
        break;

      default:
        break;
    }

  }

  minusculas(campo: number) {


    switch (campo) {
      case 1:
        this.medico.correo = this.convertirMinusculas(this.form.controls['correo'].value);
        this.form.controls['correo'].setValue(this.medico.correo);
        break;
      case 2://rfc
        this.medico.correo2 = this.convertirMinusculas(this.form.controls['correoc'].value);
        this.form.controls['correoc'].setValue(this.medico.correo2);
        break;

      default:
        break;
    }
  }

  public btnValidarMatricula() {
    this.medico.matricula = this.form.controls['matricula'].value

    if (this.existeMatricula(this.medico.matricula)) {
      this.validarMatricula();
    } else {
      this._alertServices.alerta(this._Mensajes.MSG010);
      this.form.controls['matricula'].setValue('');
      this.medico.matricula = this.form.controls['matricula'].value
    }
  }

  private validarMatricula() {
    this.form.controls['nombre'].setValue('Ame');
    this.form.controls['apellidoP'].setValue('Vcitoria');
    this.form.controls['apellidoM'].setValue('SArmiento');
    this.form.controls['curp'].setValue('VISA900901MTLCRM00');
    this.form.controls['rfc'].setValue('VISA900901LA3');

    this.medico.apellidoP = this.form.controls['apellidoP'].value;
    this.medico.apellidoM = this.form.controls['apellidoM'].value;
    this.medico.curp = this.form.controls['curp'].value;
    this.medico.rfc = this.form.controls['rfc'].value;

    console.log("datos del medico", this.medico);
  }

  private existeMatricula(matricula: string): boolean {
    let blnExiste = false;
    if (matricula === '1234567890') {
      blnExiste = true;
    }
    return blnExiste;
  }

}
