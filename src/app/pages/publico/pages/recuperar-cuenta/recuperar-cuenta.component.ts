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
  formRecuperarCuenta!: FormGroup;
  fb: FormBuilder = inject(FormBuilder);

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
      accept: () => {
      },
      reject: () => {
      }
    });
  }

  recuperarContrasenia() {
    console.log('');
  }

}
