import {Component, inject} from '@angular/core';
import {Button} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {PATRON_CURP} from '@utils/regex';
import {AlphanumericDirective} from '@directives/only-alphanumeric.directive';

@Component({
  selector: 'app-recuperar-cuenta',
  imports: [
    Button,
    InputTextModule,
    ReactiveFormsModule,
    AlphanumericDirective
  ],
  templateUrl: './recuperar-cuenta.component.html',
  styleUrl: './recuperar-cuenta.component.scss'
})
export class RecuperarCuentaComponent {
  formRecuperarCuenta!: FormGroup;
  fb: FormBuilder = inject(FormBuilder);

  constructor() {
    this.formRecuperarCuenta = this.inicializarFormulario();
  }

  inicializarFormulario(): FormGroup {
    return this.fb.group({
      curp: ['', [Validators.required, Validators.minLength(10),
        Validators.maxLength(10), Validators.pattern(PATRON_CURP)]],
      correoPersonal: ['', [Validators.required, Validators.email]]
    });
  }

  recuperarContrasenia() {
    console.log('');
  }

}
