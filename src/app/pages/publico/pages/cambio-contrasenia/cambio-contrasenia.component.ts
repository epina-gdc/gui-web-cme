import {Component, inject} from '@angular/core';
import {Card} from 'primeng/card';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Password} from 'primeng/password';
import {Divider} from 'primeng/divider';
import {PrimeTemplate} from 'primeng/api';
import {ActivatedRoute} from '@angular/router';
import {AlertService} from '@services/alert.service';

@Component({
  selector: 'app-cambio-contrasenia',
  imports: [
    Card,
    FormsModule,
    ReactiveFormsModule,
    Password,
    Divider,
    PrimeTemplate
  ],
  templateUrl: './cambio-contrasenia.component.html',
  styleUrl: './cambio-contrasenia.component.scss'
})
export class CambioContraseniaComponent {
  registroForm!: FormGroup;
  route: ActivatedRoute = inject(ActivatedRoute);
  alertaService: AlertService = inject(AlertService);

  fb: FormBuilder = inject(FormBuilder);

  token: string = '';

  REGEX_PASS: RegExp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9\s]).{8,12}$/;

  constructor() {
    this.token = this.route.snapshot.queryParams['token'];
    this.registroForm = this.crearRegistroForm();
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
  }

  validarMismoPass(): boolean {
    const nuevaContrasena = this.registroForm.get('nuevaContrasena');
    const confirmarContrasena = this.registroForm.get('confirmarContrasena');
    return nuevaContrasena?.value === confirmarContrasena?.value
  }

}
