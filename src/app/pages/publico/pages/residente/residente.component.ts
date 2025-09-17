import { Component, inject, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from "@angular/forms";
import { Card } from 'primeng/card';
import {Button} from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
@Component({
  selector: 'app-residente',
  imports: [
    Card,
    Button,
    InputTextModule,
    ReactiveFormsModule
  ],
  templateUrl: './residente.component.html',
  styleUrl: './residente.component.scss'
})
export class ResidenteComponent {
  fb = inject(FormBuilder)
  form!: FormGroup;


  
  ngOnInit(): void {
    this.form = this.inicializarForm();
  }

  inicializarForm() : FormGroup{
    return this.fb.group({
      matricula: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
    });
  }

  iniciarSesion(){
    console.log("");
  }
}
