import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Card} from 'primeng/card';
import {Button} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {GeneralComponent} from '../../../../components/general.component';
import {MedicoResidente} from '@models/datosMedico';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-residente',
  imports: [
    Card,
    Button,
    InputTextModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './residente.component.html',
  styleUrl: './residente.component.scss'
})
export class ResidenteComponent extends GeneralComponent {
  fb = inject(FormBuilder)
  form!: FormGroup;

medico!: MedicoResidente;

  ngOnInit(): void {
    this.medico = new MedicoResidente();
    this.blnBtnValidar = true;
    this.medico.matricula = '';
    this.form = this.inicializarForm();
  }

  inicializarForm(): FormGroup {
    return this.fb.group({
      matricula: ['', Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(/^[0-9]{10}$/)
      ])],

      nombre: ['', [Validators.required]],
      apellidoP: ['', [Validators.required]],
      apellidoM: ['', [Validators.required]],
      curp: ['', Validators.compose([
        Validators.required,

      ])],
      rfc: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      correoc: ['', [Validators.required]],
      pass:['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(12),
      //  Validators.pattern(/^[0-9]{10}$/)
      ])],
      passc: ['', [Validators.required]],
    });
  }

  blnBtnValidar!: boolean;

  public desbloquearValidar() {
    console.log("a desbloquear boton ");
    this.medico.matricula = this.form.controls['matricula'].value
    if (this.medico.matricula.length == 10) {
      this.blnBtnValidar = false;
    } else {
      this.blnBtnValidar = true;
    }
  }

  public btnValidar() {

this.validarMatricula();
  }

  private validarMatricula(){
    this.form.controls['nombre'].setValue('Ame');
    this.form.controls['apellidoP'].setValue('Vcitoria');
    this.form.controls['apellidoM'].setValue('SArmiento');
    this.form.controls['curp'].setValue('VISA900901MTLCRM00');
    this.form.controls['rfc'].setValue('VISA900901LA3');

    this.medico.apellidoP =this.form.controls['apellidoP'].value;
    this.medico.apellidoM =this.form.controls['apellidoM'].value;
    this.medico.curp =this.form.controls['curp'].value;
    this.medico.rfc =this.form.controls['rfc'].value;

    console.log("datos del medico",this.medico);
  }

  btnAnterior() {
    this._router.navigate(['publico/' + this._nav.crearCuenta]);
  }


  public validarCorreo(){
    console.log("validando correo");
  }

  public btnCrearCuenta() {
    this.medico.correo =this.form.controls['correo'].value;
    this.medico.correo2 =this.form.controls['correoc'].value;
    this.medico.password =this.form.controls['pass'].value;
    this.medico.password2 =this.form.controls['passc'].value;
    console.log("crear cuenta");

    if(this.form.valid){
     //this._Mensajes.MSG012
     this._router.navigate(['publico/inicio-sesion']);
    }else{
      //mostar
      //this._Mensajes.MSG013
    }
  }
}
