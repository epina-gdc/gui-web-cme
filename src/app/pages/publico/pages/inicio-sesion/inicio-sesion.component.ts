import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Card} from 'primeng/card';
import {Button} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {RecuperarCuentaComponent} from '../recuperar-cuenta/recuperar-cuenta.component';
import {CommonModule} from '@angular/common';
import {GeneralComponent} from '../../../../components/general.component';
import {passwordValidator} from '@validators/password-validator';
import {BloquearCaracterPasswordDirective} from '@directives/bloquear-caracter-password.directive';
import {PATRON_EMAIL} from '@utils/regex';
import {AuthService} from '@services/auth.service';
import {ActivatedRoute} from '@angular/router';
import {HttpRespuesta} from '@models/http-respuesta.interface';

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
  standalone: true,
  providers: [AuthService]
})
export class InicioSesionComponent extends GeneralComponent implements OnInit{

  loginService = inject(AuthService);
  fb = inject(FormBuilder)
  destroyRef = inject(DestroyRef);

  activatedRoute = inject(ActivatedRoute);

  formLogin!: FormGroup;
  vista = signal('login');
  ingresoPass: boolean = false;

  caracteresProhibidos = new Set([' ', '"', '(', ')', '[', ']', '{', '}', '!', '#', '&', '/', ',', ';', ':', '<', '>']);


  ngOnInit(): void {
    this.formLogin = this.inicializarFormLogin();

  }

  inicializarFormLogin() : FormGroup{
    return this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, passwordValidator()]],
    });
  }

  iniciarSesion(){
    if(this.formLogin.valid){
      this.loginService.login(this.formLogin.value)
      .subscribe({
        next:(respuesta: HttpRespuesta<any>) => {
          if(!respuesta.exito){
            this._alertServices.alerta(respuesta.mensaje);
            return;
          }
          this._router.navigate(['/privado'], {
            relativeTo: this.activatedRoute,
          });
        },
        error:(error) => {
          this._alertServices.alerta(error.error.mensaje);
        }
      })
    }
  }

  validarCaracterCorreo(event: KeyboardEvent){
    if(this.caracteresProhibidos.has(event.key)){
      this._alertServices.alerta(this._Mensajes.MSG002);
      event.preventDefault();
    }
  }

  validarEstructuraCorreo(event: any){
    if(!PATRON_EMAIL.test(event.target.value)){
      this._alertServices.alerta(this._Mensajes.MSG003);
    }
  }

  get f(){
    return this.formLogin.controls;
  }

}
