import {Component, inject} from '@angular/core';
import {Card} from 'primeng/card';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Password} from 'primeng/password';
import {Divider} from 'primeng/divider';
import {PrimeTemplate} from 'primeng/api';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from '@services/alert.service';
import {CambioContrasenia} from '@models/cambio-contrasenia.interface';
import {finalize} from 'rxjs';
import {AuthService} from '@services/auth.service';
import {LoaderService} from '../../../../components/loader/services/loader.service';
import {Mensajes} from '@utils/mensajes';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-cambio-contrasenia',
  imports: [
    Card,
    FormsModule,
    ReactiveFormsModule,
    Password,
    Divider,
    PrimeTemplate,
    Button
  ],
  templateUrl: './cambio-contrasenia.component.html',
  styleUrl: './cambio-contrasenia.component.scss'
})
export class CambioContraseniaComponent {
  mensajes: Mensajes = new Mensajes();
  registroForm!: FormGroup;
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  alertaService: AlertService = inject(AlertService);
  authService: AuthService = inject(AuthService);
  loaderService: LoaderService = inject(LoaderService);

  fb: FormBuilder = inject(FormBuilder);

  token: string = '';

  REGEX_PASS: RegExp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9\s]).{8,12}$/;

  constructor() {
    this.token = this.route.snapshot.queryParams['token'];
    this.registroForm = this.crearRegistroForm();
    console.log(this.token);
  }

  crearRegistroForm(): FormGroup {
    return this.fb.group({
      nuevaContrasena: ['', [Validators.required, Validators.minLength(8),
        Validators.maxLength(16), Validators.pattern(this.REGEX_PASS)]],
      confirmarContrasena: ['', [Validators.required, Validators.minLength(8),
        Validators.maxLength(16), Validators.pattern(this.REGEX_PASS)]]
    });
  }

  cambiarPassword(): void {
    if (this.registroForm.invalid) return;
    if (!this.validarMismoPass()) {
      this.alertaService.error('Las contraseñas no coinciden, favor de verificar.');
      return;
    }
    const solicitud: CambioContrasenia = this.crearSolicitudCambioPass();
    this.loaderService.activar();
    this.authService.cambiarPass(solicitud, this.token).pipe(
      finalize(() => this.loaderService.desactivar()))
      .subscribe({
          next: () => this.manejarCambioPassCorrecto(),
          error: (error: any) => this.manejarValidarCodigoError(error)
        }
      );
  }

  crearSolicitudCambioPass(): CambioContrasenia {
    return {
      nuevaContrasena: this.registroForm.get('nuevaContrasena')?.value,
    }
  }

  manejarCambioPassCorrecto(): void {
    void this.router.navigate(['/inicio-sesion']);
    this.alertaService.exito(this.mensajes.MSG062);
  }

  manejarValidarCodigoError(error: any): void {
    this.alertaService.error(this.mensajes.MSG063);
  }

  validarMismoPass(): boolean {
    const nuevaContrasena = this.registroForm.get('nuevaContrasena');
    const confirmarContrasena = this.registroForm.get('confirmarContrasena');
    return nuevaContrasena?.value === confirmarContrasena?.value
  }


}
