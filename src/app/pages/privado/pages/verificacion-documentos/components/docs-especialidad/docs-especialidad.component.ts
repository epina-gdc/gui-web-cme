import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DUMMIE_DOCS_ESPECIALIDAD } from '@utils/dummies';

import { AccordionModule } from 'primeng/accordion';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-docs-especialidad',
  imports: [AccordionModule, RadioButtonModule, TabsModule,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './docs-especialidad.component.html',
  styleUrl: './docs-especialidad.component.scss'
})
export class DocsEspecialidadComponent {

  docsEspecialidad = DUMMIE_DOCS_ESPECIALIDAD;
  selectedTitle: string = "";
  selectedCredential: string = "";
  selectedCategory: any = null;

  titleOptions = [
    { label: 'Cubre', value: 'cubre' },
    { label: 'No cubre', value: 'noCubre' }
  ];

  credentialOptions = [
    { label: 'Cubre', value: 'cubre' },
    { label: 'No cubre', value: 'noCubre' }
  ];

}
