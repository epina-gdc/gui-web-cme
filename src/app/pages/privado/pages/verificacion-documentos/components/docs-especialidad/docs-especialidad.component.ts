import {CommonModule} from '@angular/common';
import {Component, inject, Input, OnInit, signal, WritableSignal} from '@angular/core';
import {
  AbstractControl, FormArray,
  FormBuilder, FormControl,
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
      refObservaciones: ['', [Validators.required]],
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

  // Getter para acceder al FormArray principal (ya deberías tenerlo)
  get especialidadesDocumentosArray(): FormArray {
    return this.formularioValidacion.get('especialidadesDocumentos') as FormArray;
  }

// Función para obtener el FormGroup de una especialidad específica por índice
  getEspecialidadGroup(index: number): FormGroup {
    return this.especialidadesDocumentosArray.at(index) as FormGroup;
  }

// Función para obtener el FormArray de documentos de una especialidad específica
  getDocumentosArray(index: number): FormArray {
    return this.getEspecialidadGroup(index).get('documentosEspecialidad') as FormArray;
  }

// Función para obtener el FormControl específico (usado para [formControl])
  getFormControl(parentControl: AbstractControl, controlName: string): FormControl {
    return parentControl.get(controlName) as FormControl;
  }

// Función para obtener el FormGroup de estatus de verificación
  getEstatusGroup(index: number): FormGroup {
    return this.getEspecialidadGroup(index).get('evaluacionEspecialidad')?.get('estatusVerificacion') as FormGroup;
  }

  finalizarVerificacion(): void {
    if (this.formularioValidacion.invalid) {
      console.error("El formulario es inválido. Revise los campos requeridos.");
      return;
    }

    const solicitud = this.formularioValidacion.getRawValue();

    solicitud.especialidadesDocumentos = solicitud.especialidadesDocumentos.map(
      (especialidad: any) => {

        const idEstatus = especialidad.evaluacionEspecialidad.estatusVerificacion.idEstatusVerificacion;

        // Buscar la descripción (label) en la lista de opciones (estatusDocumentos)
        const estatusSeleccionado = this.estatusDocumentos.find(o => o.value === idEstatus);

        // 3. Inyectar el campo desEstatus
        if (estatusSeleccionado) {
          especialidad.evaluacionEspecialidad.estatusVerificacion.desEstatus = estatusSeleccionado.label;
        }

        return especialidad;
      }
    );

    console.log(solicitud);
  }


}
