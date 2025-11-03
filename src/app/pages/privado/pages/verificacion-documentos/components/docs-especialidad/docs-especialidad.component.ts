import {CommonModule} from '@angular/common';
import {Component, inject, Input, signal, WritableSignal} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {DUMMIE_DOCS_ESPECIALIDAD} from '@utils/dummies';

import {AccordionModule} from 'primeng/accordion';
import {RadioButtonModule} from 'primeng/radiobutton';
import {TabsModule} from 'primeng/tabs';
import {TextareaModule} from 'primeng/textarea';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {DetalleDocumentacionEspecialidadDocumento} from '@models/detalleDocumentacionAspirante.interface';
import {DocumentoService} from '@services/documentos.service';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

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

  @Input() docsEspecialidad: DetalleDocumentacionEspecialidadDocumento[] = [];

  pdfUrl: SafeResourceUrl | undefined;

  selectedTitle: string = "";
  selectedCredential: string = "";
  selectedCategory: any = null;
  observaciones: string = "";
  opciones: any;

  documentoService = inject(DocumentoService)

  titleOptions = [
    {label: 'Cubre', value: 'cubre'},
    {label: 'No cubre', value: 'noCubre'}
  ];

  credentialOptions = [
    {label: 'Cubre', value: 'cubre'},
    {label: 'No cubre', value: 'noCubre'}
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
    private sanitizer: DomSanitizer
  ) {
    this.formObservaciones = this.inicializarForm()
  }

  docSeleccionado(id: number, guid: string) {
    this.tabActive.set(id);
    this.obtenerPrevisualizacionDocumento(guid);
  }

  inicializarForm(): FormGroup {
    return this.fb.group({
      observaciones: [{value: '', disabled: false}, [Validators.required]],
    })
  }

  obtenerPrevisualizacionDocumento(guid: string) {
    this.documentoService.obtenerDocumento(guid).subscribe({
      next:(response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      },
      error: (err) => {
        console.error('Error al obtener el documento', err);
      }
    });
  }

  get f() {
    return this.formObservaciones.controls;
  }

}
