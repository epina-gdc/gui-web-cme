import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Card} from 'primeng/card';
import {Button} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';

@Component({
  selector: 'app-inicio-sesion',
  imports: [
    Card,
    Button,
    InputTextModule,
    ReactiveFormsModule
  ],
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.scss',
  standalone: true
})
export class InicioSesionComponent implements OnInit{

  fb = inject(FormBuilder)
  formLogin!: FormGroup;


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
