import {CommonModule} from '@angular/common';
import {Component, signal, WritableSignal} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {DUMMIE_DOCS_ESPECIALIDAD} from '@utils/dummies';

import {AccordionModule} from 'primeng/accordion';
import {RadioButtonModule} from 'primeng/radiobutton';
import {TabsModule} from 'primeng/tabs';
import {TextareaModule} from 'primeng/textarea';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';

@Component({
  selector: 'app-docs-especialidad',
  imports: [AccordionModule,
     RadioButtonModule,
      TabsModule,
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      TextareaModule,
      CardModule,
      ButtonModule
    ],
  templateUrl: './docs-especialidad.component.html',
  styleUrl: './docs-especialidad.component.scss'
})
export class DocsEspecialidadComponent {

  docsEspecialidad = DUMMIE_DOCS_ESPECIALIDAD;
  selectedTitle: string = "";
  selectedCredential: string = "";
  selectedCategory: any = null;
  observaciones: string = "";

  titleOptions = [
    { label: 'Cubre', value: 'cubre' },
    { label: 'No cubre', value: 'noCubre' }
  ];

  credentialOptions = [
    { label: 'Cubre', value: 'cubre' },
    { label: 'No cubre', value: 'noCubre' }
  ];

  estatusDocumentos = [
    {label: 'Cumple con requisitos', value: 'cumple'},
    {label: 'No cumple con requisitos', value: 'noCumple'},
    {label: 'Revisión documental', value: 'reivison'},
  ];

  tabActive: WritableSignal<number> = signal(0);

  formObservaciones!: FormGroup;


  constructor(
    private fb: FormBuilder,

  ){
    this.formObservaciones = this.inicializarForm()
  }

  docSeleccionado(id:number) {
    this.tabActive.set(id);
  }


  inicializarForm(): FormGroup{

    return this.fb.group({
      observaciones: [{value: '', disabled: false}, [Validators.required]],
    })
  }

  get f(){
    return this.formObservaciones.controls;
  }

}
