import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from "@angular/forms";
import {Card} from 'primeng/card';
import {Button} from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RegistroMedicoComponent } from '../registro-medico/registro-medico.component';

@Component({
  selector: 'app-inicio-sesion',
  imports: [
    Card,
    Button,
    InputTextModule,
    ReactiveFormsModule,
    RegistroMedicoComponent
  ],
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.scss',
  standalone: true
})
export class InicioSesionComponent implements OnInit{

  fb = inject(FormBuilder)
  formLogin!: FormGroup;
  vista: 'login' | 'olvideContrasenia' | 'registrarMedico' = "login";


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
