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
  private readonly TITULO_DEFAULT = 'Convocatoria para M\u00e9dicos Especialistas';

  activatedRoute = inject(ActivatedRoute);


  formLogin!: FormGroup;
  vista = signal('login');
  tituloConvocatoria = signal(this.TITULO_DEFAULT);
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
    this.tituloConvocatoria.set(convocatoria.desConvocatoria || this.TITULO_DEFAULT);
    this.subtituloConvocatoria.set(this.construirSubtitulo(convocatoria));
    this.registroActivo.set(convocatoria.registroActivo === true);
  }

  private establecerConvocatoriaDefault(): void {
    this.tituloConvocatoria.set(this.TITULO_DEFAULT);
    this.subtituloConvocatoria.set('');
    this.registroActivo.set(false);
  }

  private construirSubtitulo(convocatoria: ConvocatoriaActiva): string {
    const anioInicio = this.obtenerAnio(convocatoria.stpFechaInicioRegistro);
    const anioFin = this.obtenerAnio(convocatoria.stpFechaFinRegistro);

    if (!anioInicio && !anioFin) {
      return '';
    }

    if (!anioInicio || !anioFin || anioInicio === anioFin) {
      return `Reclutamiento IMSS ${anioInicio ?? anioFin}`;
    }

    return `Reclutamiento IMSS ${anioInicio}-${anioFin}`;
  }

  private obtenerAnio(fecha?: string | null): number | null {
    if (!fecha) {
      return null;
    }

    const anio = fecha.match(/^(\d{4})/)?.[1];
    if (anio) {
      return Number(anio);
    }

    const fechaParseada = new Date(fecha);
    return Number.isNaN(fechaParseada.getTime()) ? null : fechaParseada.getFullYear();
  }
}
