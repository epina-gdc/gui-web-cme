import {Component, inject} from '@angular/core';
import {Card} from 'primeng/card';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Password} from 'primeng/password';
import {Divider} from 'primeng/divider';
import {PrimeTemplate} from 'primeng/api';

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

  fb: FormBuilder = inject(FormBuilder);

  constructor() {
    this.registroForm = this.crearRegistroForm();
  }

  crearRegistroForm(): FormGroup {
    return this.fb.group({
      nuevaContrasena: ['', [Validators.required, Validators.minLength(8),
        Validators.maxLength(16)]],
      confirmarContrasena: ['', [Validators.required, Validators.minLength(8),
        Validators.maxLength(16)]]
    });
  }

  cambiarPassword(): void {
    if (this.registroForm.invalid) return;
    if (!this.validarMismoPass()) {
      // this.mostrarAlertaDatosInvalidos('Las contraseñas no coinciden, favor de verificar.');
      return;
    }
  }

  validarMismoPass(): boolean {
    const nuevaContrasena = this.registroForm.get('nuevaContrasena');
    const confirmarContrasena = this.registroForm.get('confirmarContrasena');
    return nuevaContrasena?.value === confirmarContrasena?.value
  }

}
