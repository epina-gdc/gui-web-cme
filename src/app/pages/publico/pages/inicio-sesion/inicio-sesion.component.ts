import {Component, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Card} from 'primeng/card';
import {Button} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {RecuperarCuentaComponent} from '../recuperar-cuenta/recuperar-cuenta.component';
import {CommonModule} from '@angular/common';
import {GeneralComponent} from '../../../../components/general.component';
import {passwordValidator} from '@validators/password-validator';
import {BloquearCaracterPasswordDirective} from '@directives/bloquear-caracter-password.directive';


@Component({
  selector: 'app-inicio-sesion',
  imports: [
    Card,
    Button,
    InputTextModule,
    ReactiveFormsModule,
    RecuperarCuentaComponent,
    CommonModule,
    BloquearCaracterPasswordDirective
  ],
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.scss',
  standalone: true
})
export class InicioSesionComponent extends GeneralComponent implements OnInit{

  fb = inject(FormBuilder)
  formLogin!: FormGroup;
  vista = signal('login');
  ingresoPass: boolean = false;


  ngOnInit(): void {
    this.formLogin = this.inicializarFormLogin();

  }

  inicializarFormLogin() : FormGroup{
    return this.fb.group({
      correoElectronico: ['', [Validators.required]],
      password: ['', [Validators.required, passwordValidator()]],
    });
  }

  iniciarSesion(){
    console.log("");
  }


  get f(){
    return this.formLogin.controls;
  }

}
