import { Component, OnInit, inject } from '@angular/core';
import {Button} from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-recuperar-cuenta',
  imports: [
    Button,
    InputTextModule,
    ReactiveFormsModule
  ],
  templateUrl: './recuperar-cuenta.component.html',
  styleUrl: './recuperar-cuenta.component.scss'
})
export class RecuperarCuentaComponent implements OnInit{
  formRecuperarCuenta!: FormGroup;
  fb = inject(FormBuilder);

  ngOnInit(): void {
      this.formRecuperarCuenta = this.inicializarFormulario();
  }

  inicializarFormulario(): FormGroup{
    return this.fb.group({
      curp: ['', [Validators.required]],
      correoPersonal: ['', [Validators.required, Validators.email]]
    });
  }

  recuperarContrasenia(){
    console.log('');
  }

}
