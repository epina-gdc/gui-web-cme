import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from "@angular/forms";
import {Card} from 'primeng/card';
import {Button} from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RecuperarCuentaComponent } from '../recuperar-cuenta/recuperar-cuenta.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio-sesion',
  imports: [
    Card,
    Button,
    InputTextModule,
    ReactiveFormsModule,
    RecuperarCuentaComponent,
    CommonModule
  ],
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.scss',
  standalone: true
})
export class InicioSesionComponent implements OnInit{

  fb = inject(FormBuilder)
  formLogin!: FormGroup;
  vista = signal('login');


  ngOnInit(): void {
    this.formLogin = this.inicializarFormLogin();
  }

  inicializarFormLogin() : FormGroup{
    return this.fb.group({
      correoElectronico: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  iniciarSesion(){
    console.log("");
  }

}
