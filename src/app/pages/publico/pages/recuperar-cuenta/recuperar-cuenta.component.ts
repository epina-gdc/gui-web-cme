import {Component, inject} from '@angular/core';
import {Button} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {PATRON_CURP} from '@utils/regex';
import {AlphanumericDirective} from '@directives/only-alphanumeric.directive';
import {EmailAllowCaractersDirective} from '@directives/email-allow-caracters.directive';
import {NgClass} from '@angular/common';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import {Card} from 'primeng/card';
import {SolicitudCambioContrasenia} from '@models/solicitud-cambio-contrasenia.interface';
import {AuthService} from '@services/auth.service';
import {LoaderService} from '../../../../components/loader/services/loader.service';
import {finalize} from 'rxjs';
import {AlertService} from '@services/alert.service';
import {Mensajes} from '@utils/mensajes';
import {Router} from '@angular/router';

@Component({
  selector: 'app-recuperar-cuenta',
  imports: [
    Button,
    InputTextModule,
    ReactiveFormsModule,
    AlphanumericDirective,
    EmailAllowCaractersDirective,
    NgClass,
    ConfirmDialog,
    Card
  ],
  templateUrl: './recuperar-cuenta.component.html',
  styleUrl: './recuperar-cuenta.component.scss',
  providers: [ConfirmationService]
})
export class RecuperarCuentaComponent {
  mensajes: Mensajes = new Mensajes();
  formRecuperarCuenta!: FormGroup;
  fb: FormBuilder = inject(FormBuilder);
  authService: AuthService = inject(AuthService);
  loaderService: LoaderService = inject(LoaderService);
  alertaService: AlertService = inject(AlertService);

  private readonly router = inject(Router);

  constructor(private readonly confirmationService: ConfirmationService) {
    this.formRecuperarCuenta = this.inicializarFormulario();
  }

  inicializarFormulario(): FormGroup {
    return this.fb.group({
      curp: ['', [Validators.required, Validators.minLength(18),
        Validators.maxLength(18), Validators.pattern(PATRON_CURP)]],
      correoPersonal: ['', [Validators.required, Validators.email]]
    });
  }

  abrirModalRecuperarContrasenia() {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea cambiar su contraseña?',
      icon: 'pi pi-exclamation-circle',
      acceptButtonProps: {
        label: 'Sí',
      },
      rejectButtonProps: {
        label: 'No',
        severity: 'danger'
      },
      accept: () => this.recuperarContrasenia(),
      reject: () => {
      }
    });
  }

  recuperarContrasenia(): void {
    const solicitud: SolicitudCambioContrasenia = this.generarSolicitudRecuperacionContrasenia();
    this.loaderService.activar();
    this.authService.solicitarCambioPass(solicitud).pipe(
      finalize(() => this.loaderService.desactivar())
    ).subscribe({
      next: () => this.manejarSolicitudCambioPassCorrecto(),
      error: (error) => this.manejarValidarCodigoError(error),
    });
  }

  manejarSolicitudCambioPassCorrecto(): void {
    void this.router.navigate(['/iniciar-sesion']);
    this.alertaService.exito(this.mensajes.MSG017);
  }

  manejarValidarCodigoError(error: any): void {
    if (error.mensaje === 'Usuario no encontrado.') {
      this.alertaService.error(this.mensajes.MSG018);
      return;
    }
    if (!error.mensaje) {
      this.alertaService.error('Ocurrió un error, por favor intente más tarde.');
      return;
    }
    this.alertaService.error(error.mensaje);
  }


  generarSolicitudRecuperacionContrasenia(): SolicitudCambioContrasenia {
    return {
      refCurp: this.formRecuperarCuenta.get('curp')?.value,
      refEmail: this.formRecuperarCuenta.get('correoPersonal')?.value
    }
  }

  get f() {
    return this.formRecuperarCuenta.controls;
  }


}
