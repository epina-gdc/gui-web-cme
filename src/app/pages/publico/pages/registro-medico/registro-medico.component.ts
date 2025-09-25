import { Component, inject, OnInit } from '@angular/core';
import { Card } from 'primeng/card';
import { GeneralComponent } from '../../../../components/general.component';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';


import { CommonModule } from '@angular/common';
import { CatalogoGeneral } from '@models/catalogoGeneral';
import { RegistroMedico } from '@models/datosMedico';
import { BtnRegresarComponent } from '../../../../components/btn-regresar/btn-regresar.component';
import { passwordValidator } from '@validators/password-validator';
import { PATRON_CURP, PATRON_EMAIL, PATRON_MATRICULA, PATRON_NOMBRE, PATRON_RFC } from '@utils/regex';
@Component({
  selector: 'app-registro-medico',
  imports: [
    Card,
    Button,
    Select,
    InputTextModule,
    ReactiveFormsModule,
    CommonModule,
    BtnRegresarComponent,
  ],
  standalone: true,
  templateUrl: './registro-medico.component.html',
  styleUrl: './registro-medico.component.scss'
})
export class RegistroMedicoComponent extends GeneralComponent {
  fb = inject(FormBuilder)
  form!: FormGroup;
  strTitulo!: string;
  medico!: RegistroMedico;
  lstModalidad!: Array<CatalogoGeneral>;
  ruta: string = '';
  inMatricula: boolean = false;
  inNombre: boolean = false;
  inCurp: boolean = false;
  inRfc: boolean = false;
  inAp: boolean = false;
  inAm: boolean = false;
  inCorreo: boolean = false;
  inPasaporte: boolean = false;
  inPais: boolean = false;
  inCorreo2: boolean = false;
  inPass: boolean = false;
  inPass2: boolean = false;
  ngOnInit(): void {
    this.ruta = this._nav.publico + this._nav.crearCuenta;
    this.blnPassIguales = false;
    this.blnCorreosIguales = false;
    this.lstModalidad = this.getCatalogoModalidad();
    this.form = this.inicializarForm();
    this.msjForm();

    let x = this.getSession('registroMedico');
    if (x) {
      this.medico = x;

      if (this.medico.perfil == 1) {
        this.strTitulo = 'Residente IMSS';
        this.isResidente();
      } else {
        this.strTitulo = 'Médico externo';
        this.isExterno();

        if (this.medico.blnPasaporte) {
          this.isPasaporte();

        } else {
          this.isCurp();
        }
      }
    } else {
      this.medico = new RegistroMedico();
    }

    this.blnBtnValidar = true;
    this.medico.curp = '';

    this.form.controls['modalidad'].setValue(this.medico.modalidad);
    console.log("form de registro: ", this.medico);
  }


  ngOnDestroy() {


    this.removeSession('registroMedico');

  }

  private activarCampos(perfil: number) {
    this.inNombre = true;
    this.inRfc = true;
    this.inAp = true;
    this.inAm = true;
    this.inCorreo = true;
    this.inCorreo2 = true;
    this.inPass = true;
    this.inPass2 = true;
    switch (perfil) {
      case 1:


        this.isNotCurp();

        break;
      case 2://



        debugger
        if (this.medico.blnPasaporte) {
          this.inPasaporte = true;
          this.inPais = true;
          this.isNotCurp();
        } else {

          this.isCurp();
        
        }
        break;

      default:
        break;
    }
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

  private clearCampos() {
    this.form.controls['matricula'].setValidators([]),
      this.form.controls['modalidad'].setValidators([]);
    this.form.controls['pasaporte'].setValidators([]);
    this.form.controls['pais'].setValidators([]);
    this.form.controls['modalidad'].updateValueAndValidity();
    this.form.controls['pasaporte'].updateValueAndValidity();
    this.form.controls['pais'].updateValueAndValidity();
    this.form.controls['matricula'].updateValueAndValidity();
    this.inNombre = false;
    this.inCurp = false;
    this.inRfc = false;
    this.inAp = false;
    this.inAm = false;
  }

  private isPasaporte() {
    this.clearCampos();
    this.form.controls['modalidad'].setValidators([Validators.required]);
    this.form.controls['pasaporte'].setValidators([Validators.required]);
    this.form.controls['pais'].setValidators([Validators.required]);
    this.form.controls['modalidad'].updateValueAndValidity();
    this.form.controls['pasaporte'].updateValueAndValidity();
    this.form.controls['pais'].updateValueAndValidity();
    //this.inPasaporte = true;
  }

  private isCurp() {


    this.form.controls['curp'].setValidators([Validators.required, Validators.minLength(18),
    Validators.maxLength(18),
    Validators.pattern(PATRON_CURP)]);


    this.form.controls['curp'].updateValueAndValidity();
    this.inCurp = true;

  }

  private isNotCurp() {
    this.form.controls['curp'].setValidators([]),
      this.form.controls['curp'].updateValueAndValidity();
    this.inCurp = false;

  }
  private isResidente() {
    this.clearCampos();
    this.form.controls['matricula'].setValidators([Validators.required, Validators.minLength(10),
    Validators.minLength(10),
    Validators.maxLength(10),
    Validators.pattern(PATRON_MATRICULA)]);




    this.form.controls['matricula'].updateValueAndValidity();

  }

  private isExterno() {
    this.clearCampos();
    this.form.controls['modalidad'].setValidators([Validators.required]);
    this.form.controls['modalidad'].updateValueAndValidity();

  }
  msjValidation: any = {};
  msjForm(): void {
    this.msjValidation = {
      'modalidad': [
        { type: 'required', msj: this._Mensajes.MSJ_CAMPO_REQUERIDO },],
      'matricula': [
        { type: 'required', msj: this._Mensajes.MSJ_CAMPO_REQUERIDO },
        { type: 'pattern', msj: this._Mensajes.MSJ_FORMATO_MATRICULA },
        { type: 'minlength', msj: this._Mensajes.MSJ_LONG_MATRICULA },
      ],
      'pasaporte': [
        { type: 'required', msj: this._Mensajes.MSJ_CAMPO_REQUERIDO },],
      'pais': [
        { type: 'required', msj: this._Mensajes.MSJ_CAMPO_REQUERIDO },],
      'nombre': [
        { type: 'required', msj: this._Mensajes.MSJ_CAMPO_REQUERIDO },
        { type: 'pattern', msj: this._Mensajes.MSJ_FORMATO_NO_VALIDO },
      ],
      'apellidoP': [
        { type: 'required', msj: this._Mensajes.MSJ_CAMPO_REQUERIDO },
        { type: 'pattern', msj: this._Mensajes.MSJ_FORMATO_NO_VALIDO },],
      'apellidoM': [
        { type: 'required', msj: this._Mensajes.MSJ_CAMPO_REQUERIDO },
        { type: 'pattern', msj: this._Mensajes.MSJ_FORMATO_NO_VALIDO },],
      'curp': [
         { type: 'required', msj: this._Mensajes.MSJ_CAMPO_REQUERIDO },
        { type: 'minlength', msj: this._Mensajes.MSJ_LONG_CURP },
        { type: 'pattern', msj: this._Mensajes.MSJ_FORMATO_NO_VALIDO },
      ],

      'rfc': [
        { type: 'required', msj: this._Mensajes.MSJ_CAMPO_REQUERIDO },
        { type: 'minlength', msj: this._Mensajes.MSJ_LONG_RFC },
        { type: 'pattern', msj: this._Mensajes.MSJ_FORMATO_NO_VALIDO },
      ],
      'correo': [
        { type: 'required', msj: this._Mensajes.MSJ_CAMPO_REQUERIDO },
        { type: 'pattern', msj: this._Mensajes.MSJ_FORMATO_NO_VALIDO },

      ],
      'correoc': [
        { type: 'required', msj: this._Mensajes.MSJ_CAMPO_REQUERIDO },
        { type: 'pattern', msj: this._Mensajes.MSJ_FORMATO_NO_VALIDO },

      ],
      'pass': [
        { type: 'required', msj: this._Mensajes.MSJ_CAMPO_REQUERIDO },
        //{ type: 'pattern', msj: this._Mensajes.MSJ_FORMATO_NO_VALIDO },
        { type: 'caracter', msj: this._Mensajes.MSJ_PASS_CARACTER_ESPECIAL },
        { type: 'numero', msj: this._Mensajes.MSJ_PASS_NUMERO },
        { type: 'minLength', msj: this._Mensajes.MSJ_PASS_MIN_CARACTER },
        { type: 'maxLength', msj: this._Mensajes.MSJ_PASS_MAX_CARACTER },
        { type: 'mayuscula', msj: this._Mensajes.MSJ_PASS_MAYUSCULA },
        { type: 'minuscula', msj: this._Mensajes.MSJ_PASS_MINUSCULA },
      ],
      'passc': [
        { type: 'required', msj: this._Mensajes.MSJ_CAMPO_REQUERIDO },
        //{ type: 'pattern', msj: this._Mensajes.MSJ_FORMATO_NO_VALIDO },
        { type: 'caracter', msj: this._Mensajes.MSJ_PASS_CARACTER_ESPECIAL },
        { type: 'numero', msj: this._Mensajes.MSJ_PASS_NUMERO },
        { type: 'minLength', msj: this._Mensajes.MSJ_PASS_MIN_CARACTER },
        { type: 'maxLength', msj: this._Mensajes.MSJ_PASS_MAX_CARACTER },
        { type: 'mayuscula', msj: this._Mensajes.MSJ_PASS_MAYUSCULA },
        { type: 'minuscula', msj: this._Mensajes.MSJ_PASS_MINUSCULA },
      ],



    }



  }

  get f() {
    return this.form.controls;
  }
  inicializarForm(): FormGroup {
    return this.fb.group({
      modalidad: ['', ''],
      matricula: ['', ''],
      pasaporte: ['', ''],
      pais: ['', ''],
      nombre: ['', [Validators.required, Validators.pattern(PATRON_NOMBRE)]],
      apellidoP: ['', [Validators.required, Validators.pattern(PATRON_NOMBRE)]],
      apellidoM: ['', [Validators.required, Validators.pattern(PATRON_NOMBRE)]],
      curp: ['', Validators.compose([
         Validators.required,
        Validators.minLength(18),
        Validators.maxLength(18),
        Validators.pattern(PATRON_CURP),

      ])],
      rfc: ['', Validators.compose([
        Validators.required,
        Validators.minLength(13),
        Validators.maxLength(13),
        Validators.pattern(PATRON_RFC)

      ])],
      correo: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.pattern(PATRON_EMAIL)

      ])],
      correoc: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.pattern(PATRON_EMAIL)

      ])],
      pass: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(12),
        passwordValidator()
      ])],
      passc: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(12),
        passwordValidator()
      ])],
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

  public btnValidarCurp() {
    if (!this.blnBtnValidar) {
      this.medico.curp = this.form.controls['curp'].value;
      if (this.medico.curp.length == 18) {
        this.validarCURP();
      }
    }

  }

  private validarCURP() {
    this.form.controls['nombre'].setValue('Ame');
    this.form.controls['apellidoP'].setValue('Vcitoria');
    this.form.controls['apellidoM'].setValue('SArmiento');
    this.form.controls['curp'].setValue('VISA900901MTLCRM00');
    this.inCurp = true;
    this.form.controls['rfc'].setValue('VISA900901LA3');

    this.medico.apellidoP = this.form.controls['apellidoP'].value;
    this.medico.apellidoM = this.form.controls['apellidoM'].value;
    this.medico.curp = this.form.controls['curp'].value;
    this.medico.rfc = this.form.controls['rfc'].value;
    this.activarCampos(this.medico.perfil);
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
      this.activarCampos(this.medico.perfil);
    }
  }


  private guardarRegistro() {
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


  public dinamicoCurp() {
    this.medico.curp = this.form.controls['curp'].value
    if (this.medico.curp.length > 0) {
      this.isCurp();
    } else {
      this.isNotCurp();
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
      this.form.reset();
    }
  }

  private validarMatricula() {
    this.form.controls['nombre'].setValue('Ame');
    this.form.controls['apellidoP'].setValue('Vcitoria');
    // this.form.controls['apellidoM'].setValue('SArmiento');
    this.form.controls['curp'].setValue('VISA900901MTLCRM0');

    this.form.controls['rfc'].setValue('VISA900901LA');

    this.medico.apellidoP = this.form.controls['apellidoP'].value;
    this.medico.apellidoM = this.form.controls['apellidoM'].value;
    this.medico.curp = this.form.controls['curp'].value;

    this.medico.rfc = this.form.controls['rfc'].value;
    this.activarCampos(this.medico.perfil);
    this.dinamicoCurp();

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
