import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Card} from 'primeng/card';
import {Button} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {CommonModule} from '@angular/common';
import {GeneralComponent} from '@components/general.component';
import {passwordValidator} from '@validators/password-validator';
import {BloquearCaracterPasswordDirective} from '@directives/bloquear-caracter-password.directive';
import {PATRON_EMAIL} from '@utils/regex';
import {AuthService} from '@services/auth.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {HttpRespuesta} from '@models/http-respuesta.interface';
import {EmailAllowCaractersDirective} from '@directives/email-allow-caracters.directive';

@Component({
  selector: 'app-inicio-sesion',
  imports: [
    Card,
    Button,
    InputTextModule,
    ReactiveFormsModule,
    CommonModule,
    BloquearCaracterPasswordDirective,
    RouterLink,
    EmailAllowCaractersDirective
  ],
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.scss',
  standalone: true,
  providers: [AuthService]
})
export class InicioSesionComponent extends GeneralComponent implements OnInit {

  loginService = inject(AuthService);
  fb = inject(FormBuilder)
  destroyRef = inject(DestroyRef);

  activatedRoute = inject(ActivatedRoute);


  formLogin!: FormGroup;
  vista = signal('login');
  ingresoPass: boolean = false;

  caracteresProhibidos = new Set([' ', '"', '(', ')', '[', ']', '{', '}', '!', '#', '&', '/', ',', ';', ':', '<', '>']);

  fechaActual = new Date();


  ngOnInit(): void {
    this.formLogin = this.inicializarFormLogin();

  }

  inicializarFormLogin(): FormGroup {
    return this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordValidator()]],
    });
  }

  iniciarSesion() {
    if (this.formLogin.invalid) {
      this._alertServices.alerta('Por favor, completa todos los campos obligatorios.');
      return;
    }
    this.loginService.login(this.formLogin.value)
      .subscribe({
        next: (respuesta: HttpRespuesta<any>) => {
          if (!respuesta.exito) {
            this._alertServices.alerta(respuesta.mensaje);
            return;
          }

          /* SE COMENTA TIMER
          // Guarda el timestamp actual.
              const loginTime = Date.now();
              localStorage.setItem('login_time', loginTime.toString());

                this.sessionTimerService.startTimer(); */

          void this._router.navigate(['/privado/inicio'], {relativeTo: this.activatedRoute,});
        },
        error: (error) => {
          if (error.error.mensaje.includes('Usuario no encontrado con email')) {
            this._alertServices.error('El correo electrónico no está registrado. Verifica tu información o regístrate.');
            return;
          }
          if (error) {
            this._alertServices.error(error.error.mensaje);
          }
        }
      })
  }

  validarCaracterCorreo(event: KeyboardEvent) {
    if (this.caracteresProhibidos.has(event.key)) {
      this._alertServices.alerta(this._Mensajes.MSG002);
      event.preventDefault();
    }
  }

  validarEstructuraCorreo(event: any) {
    if (!PATRON_EMAIL.test(event.target.value)) {
      this._alertServices.alerta(this._Mensajes.MSG003);
    }
  }

  get f() {
    return this.formLogin.controls;
  }

  crearCuenta() {
    this._router.navigate(['publico/' + this._nav.crearCuenta])
  }
}
