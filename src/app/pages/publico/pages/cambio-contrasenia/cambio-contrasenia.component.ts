import {Component, inject} from '@angular/core';
import {AlphanumericDirective} from '@directives/only-alphanumeric.directive';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {EmailAllowCaractersDirective} from '@directives/email-allow-caracters.directive';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Password} from 'primeng/password';
import {NgClass} from '@angular/common';
import {Divider} from 'primeng/divider';
import {PrimeTemplate} from 'primeng/api';

@Component({
  selector: 'app-cambio-contrasenia',
  imports: [
    AlphanumericDirective,
    Button,
    Card,
    EmailAllowCaractersDirective,
    FormsModule,
    InputText,
    ReactiveFormsModule,
    Password,
    NgClass,
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
      nuevaContrasena: [''],
      confirmarContrasena: ['']
    });
  }

  cambiarPassword(): void {

  }

}
