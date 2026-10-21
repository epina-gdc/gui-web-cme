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
import {ConfirmationService} from 'primeng/api';
import {ConfirmDialog} from 'primeng/confirmdialog';
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
    EmailAllowCaractersDirective,
    ConfirmDialog
  ],
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.scss',
  standalone: true,
  providers: [ConfirmationService]
})
export class InicioSesionComponent extends GeneralComponent implements OnInit {


  fb = inject(FormBuilder)
  destroyRef = inject(DestroyRef);
  private readonly confirmationService = inject(ConfirmationService);

  activatedRoute = inject(ActivatedRoute);


  formLogin!: FormGroup;
  vista = signal('login');
  tituloConvocatoria = signal('');
  subtituloConvocatoria = signal('');
  registroActivo = signal(false);
  ingresoPass: boolean = false;
  evaluandoReingreso = false;
  registroBloqueadoPorReingreso = false;

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
            if (respuesta.respuesta?.requiereEvaluacion === true) {
              this.evaluarReingreso(this.formLogin.controls['username'].value, respuesta.mensaje);
              return;
            }
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

  private evaluarReingreso(correo: string, mensajeInicioSesion: string): void {
    if (this.evaluandoReingreso || this.registroBloqueadoPorReingreso) {
      return;
    }

    this.evaluandoReingreso = true;
    this._RegistroMedicoService.evaluarReingreso({refEmail: correo.trim()}).subscribe({
      next: (respuesta) => {
        if (!respuesta.exito) {
          this.evaluandoReingreso = false;
          this._alertServices.error(respuesta.mensaje || 'No fue posible evaluar el reingreso.');
          return;
        }

        const evaluacion = respuesta.respuesta;
        if (!evaluacion?.requiereConfirmacionReingreso) {
          this.evaluandoReingreso = false;
          this._alertServices.alerta(mensajeInicioSesion);
          return;
        }

        const idParticipacionAnterior = Number(evaluacion.idParticipacionAnterior);
        if (!Number.isFinite(idParticipacionAnterior) || idParticipacionAnterior <= 0) {
          this.evaluandoReingreso = false;
          this._alertServices.error('No fue posible identificar la participación previa para confirmar el reingreso.');
          return;
        }

        this.mostrarConfirmacionReingreso(respuesta.mensaje, idParticipacionAnterior);
      },
      error: (error) => {
        this.evaluandoReingreso = false;
        this._alertServices.error(
          error.error?.mensaje ?? error.error?.message ?? 'No fue posible evaluar el reingreso.'
        );
      }
    });
  }

  private mostrarConfirmacionReingreso(mensaje: string, idParticipacionAnterior: number): void {
    this.confirmationService.confirm({
      header: 'Participación previa',
      message: mensaje,
      icon: 'pi pi-info-circle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      accept: () => this.confirmarReingreso(idParticipacionAnterior),
      reject: () => {
        this.evaluandoReingreso = false;
        this.registroBloqueadoPorReingreso = true;
      }
    });
  }

  private confirmarReingreso(idParticipacionAnterior: number): void {
    this._RegistroMedicoService.confirmarReingreso(idParticipacionAnterior).subscribe({
      next: (respuesta) => {
        this.evaluandoReingreso = false;
        if (!respuesta.exito) {
          this._alertServices.error(respuesta.mensaje || 'No fue posible confirmar el reingreso.');
          return;
        }

        this._alertServices.exito(respuesta.mensaje || 'El reingreso se realizó correctamente.');
      },
      error: (error) => {
        this.evaluandoReingreso = false;
        this._alertServices.error(
          error.error?.mensaje ?? error.error?.message ?? 'No fue posible confirmar el reingreso.'
        );
      }
    });
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
