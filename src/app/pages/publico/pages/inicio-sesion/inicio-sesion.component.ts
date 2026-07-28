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
import {ActivatedRoute, RouterLink} from '@angular/router';
import {HttpRespuesta} from '@models/http-respuesta.interface';
import {EmailAllowCaractersDirective} from '@directives/email-allow-caracters.directive';
import {ConvocatoriaActiva} from '@models/convocatoria.interface';
import {
  construirEncabezadoConvocatoriaActiva,
  TITULO_CONVOCATORIA_DEFAULT
} from '@utils/convocatoria-activa';

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

})
export class InicioSesionComponent extends GeneralComponent implements OnInit {


  fb = inject(FormBuilder)
  destroyRef = inject(DestroyRef);

  activatedRoute = inject(ActivatedRoute);


  formLogin!: FormGroup;
  vista = signal('login');
  tituloConvocatoria = signal('');
  subtituloConvocatoria = signal('');
  registroActivo = signal(false);
  ingresoPass: boolean = false;

  caracteresProhibidos = new Set([' ', '"', '(', ')', '[', ']', '{', '}', '!', '#', '&', '/', ',', ';', ':', '<', '>']);

  fechaActual = new Date();


  ngOnInit(): void {
    this.formLogin = this.inicializarFormLogin();
    this.obtenerConvocatoriaActiva();

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
    this.authService.login(this.formLogin.value)
      .subscribe({
        next: (respuesta: HttpRespuesta<any>) => {
          if (!respuesta.exito) {
            this._alertServices.alerta(respuesta.mensaje);
            return;
          }

          const usuario = this.authService.usuarioSesion;

          /* SE COMENTA TIMER
          // Guarda el timestamp actual.
              const loginTime = Date.now();
              localStorage.setItem('login_time', loginTime.toString());

                this.sessionTimerService.startTimer(); */
          if (usuario && usuario.idPerfil === 1 && usuario.url) {
            void this._router.navigate([`/privado/${usuario.url}`]);
          } else {
            void this._router.navigate(['/privado/inicio'], {relativeTo: this.activatedRoute});
          }
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
    if (!this.registroActivo()) {
      return;
    }
    this._router.navigate(['publico/' + this._nav.crearCuenta])
  }

  private obtenerConvocatoriaActiva(): void {
    this._CatalogoGenService.getConvocatoriaActiva()
      .subscribe({
        next: (response: HttpRespuesta<ConvocatoriaActiva | undefined>) => {
          if (!response.exito || !response.respuesta) {
            this.establecerConvocatoriaDefault();
            return;
          }
          this.establecerConvocatoriaActiva(response.respuesta);
        },
        error: (error) => {
          console.log('Error al consultar convocatoria activa', error);
          this.establecerConvocatoriaDefault();
        }
      });
  }

  private establecerConvocatoriaActiva(convocatoria: ConvocatoriaActiva): void {
    const encabezado = construirEncabezadoConvocatoriaActiva(convocatoria);
    this.tituloConvocatoria.set(encabezado.titulo);
    this.subtituloConvocatoria.set(encabezado.subtitulo);
    this.registroActivo.set(encabezado.registroActivo);
  }

  private establecerConvocatoriaDefault(): void {
    const encabezado = construirEncabezadoConvocatoriaActiva();
    this.tituloConvocatoria.set(encabezado.titulo);
    this.subtituloConvocatoria.set(encabezado.subtitulo);
    this.registroActivo.set(encabezado.registroActivo);
  }
}
