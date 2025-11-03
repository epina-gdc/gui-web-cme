import {CommonModule} from '@angular/common';
import {Component, inject, Input, OnInit, signal, WritableSignal} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
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
export class DocsEspecialidadComponent implements OnInit {

  @Input() docsEspecialidad: DetalleDocumentacionEspecialidadDocumento[] = [];
  @Input() idUsuario: number | null = null;

  formularioValidacion!: FormGroup;

  pdfUrl: SafeResourceUrl | undefined;

  opciones: any;

  documentoService = inject(DocumentoService)

  credentialOptions = [
    {label: 'Cubre', value: '1'},
    {label: 'No cubre', value: '0'}
  ];

  estatusDocumentos = [
    {label: 'Cumple con requisitos', value: '1'},
    {label: 'No cumple con requisitos', value: '0'},
    {label: 'Revisión documental', value: '2'},
  ];

  tabActive: WritableSignal<number> = signal(0);

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {
    this.formularioValidacion = this.fb.group({
      datosPersonales: this.fb.group({
        idUsuario: [this.idUsuario, Validators.required]
      }),
      refObservaciones: ['', []],
      especialidadesDocumentos: this.fb.array(
        this.docsEspecialidad.map(especialidad =>
          this.crearGrupoEspecialidad(especialidad)
        )
      )
    });
  }

  crearGrupoEspecialidad(especialidad: DetalleDocumentacionEspecialidadDocumento): FormGroup {
    const documentosArray = especialidad.documentosEspecialidad.map(doc =>
      this.fb.group({
        idDocumentoEspecialidad: [doc.idDocumentoEspecialidad],
        // Convertir '1' a true, '0' a false, y null a false
        indCubre: [doc.indCubre === '1' ? true : doc.indCubre === '0' ? false : null]
      }));

    const idEstatusVerificacionInicial = especialidad.evaluacionEspecialidad
      ? (especialidad.evaluacionEspecialidad as any)?.estatusVerificacion?.idEstatusVerificacion || null
      : null;

    return this.fb.group({
      idEspecialidadDocumento: [especialidad.idEspecialidadDocumento],
      cveEspecialidad: [especialidad.cveEspecialidad],
      desEspecialidad: [especialidad.desEspecialidad],
      documentosEspecialidad: this.fb.array(documentosArray),
      evaluacionEspecialidad: this.fb.group({
        // Se incluye idEspecialidadEvaluacion aunque sea null.
        idEspecialidadEvaluacion: [null],
        estatusVerificacion: this.fb.group({
          // Este es el control de selección a nivel de especialidad (Cumple/No Cumple)
          idEstatusVerificacion: [idEstatusVerificacionInicial, Validators.required]
        })
      })
    });
  }

  docSeleccionado(id: number, guid: string) {
    this.tabActive.set(id);
    this.obtenerPrevisualizacionDocumento(guid);
  }

  obtenerPrevisualizacionDocumento(guid: string) {
    this.documentoService.obtenerDocumento(guid).subscribe({
      next: (response) => {
        const blob = new Blob([response], {type: 'application/pdf'});
        const url = URL.createObjectURL(blob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      },
      error: (err) => {
        console.error('Error al obtener el documento', err);
      }
    });
  }

}
