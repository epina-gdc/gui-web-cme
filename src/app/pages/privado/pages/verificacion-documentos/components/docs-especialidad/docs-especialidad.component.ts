import {CommonModule} from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
  signal,
  WritableSignal
} from '@angular/core';
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
import {VerificacionDocsService} from '@services/verificacion-docs.service';
import {RouterLink} from '@angular/router';
import {AlertService} from '@services/alert.service';
import {Mensajes} from '@utils/mensajes';
import { DialogModule } from 'primeng/dialog';

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
    ButtonModule, 
    RouterLink,
    DialogModule
  ],
  templateUrl: './docs-especialidad.component.html',
  styleUrl: './docs-especialidad.component.scss'
})
export class DocsEspecialidadComponent implements OnInit {

  @Input() docsEspecialidad: DetalleDocumentacionEspecialidadDocumento[] = [];
  @Input() idUsuario: number | null = null;
  @Input() observaciones: string = '';
  @Input() estatusId: number | null = null;

  @Output() actualizarRegistro: EventEmitter<boolean> = new EventEmitter();

  private readonly MOBILE_BREAKPOINT = 984;

  isMobileView: boolean = false;

  formularioValidacion!: FormGroup;

  formSeleccionado!: FormGroup;

  verificacionDocsService: VerificacionDocsService = inject(VerificacionDocsService)

  pdfUrl: SafeResourceUrl | undefined;

  documentoService = inject(DocumentoService)

  confCambioEstatus: boolean = false;
  estatusPrevio: string = "";

  credentialOptions = [
    {label: 'Cubre', value: '1'},
    {label: 'No cubre', value: '0'}
  ];

  estatusDocumentos = [
    {label: 'Cumple con requisitos', value: '3'},
    {label: 'No cumple con requisitos', value: '4'},
    {label: 'Revisión documental', value: '2'},
  ];

  tabActive: WritableSignal<number> = signal(0);

  alertaService = inject(AlertService);

  mensajes: Mensajes = new Mensajes();

  constructor(
    private readonly fb: FormBuilder,
    private readonly sanitizer: DomSanitizer
  ) {
    this.checkScreenSize();
  }


  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isMobileView = window.innerWidth < this.MOBILE_BREAKPOINT;
  }

  ngOnInit(): void {
    this.formularioValidacion = this.fb.group({
      datosPersonales: this.fb.group({
        idUsuario: [this.idUsuario, Validators.required]
      }),
      refObservaciones: [this.observaciones, [Validators.required]],
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
        indCubre: [doc.indCubre ?? null]
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
        idEspecialidadEvaluacion: [especialidad.evaluacionEspecialidad?.idEspecialidadEvaluacion ?? null],
        estatusVerificacion: this.fb.group({
          // Este es el control de selección a nivel de especialidad (Cumple/No Cumple)
          idEstatusVerificacion: [idEstatusVerificacionInicial, Validators.required]
        })
      })
    });
  }

  estatusRequisitoCambio(form: FormGroup, prev: any){
    if(form.get('idEstatusVerificacion')?.value == '3'){
      this.estatusPrevio = prev.evaluacionEspecialidad.estatusVerificacion.idEstatusVerificacion.toString();
      this.confCambioEstatus = true
      this.formSeleccionado = form;
    }
  }

  cambiarEstatus(cambio: boolean){
    this.confCambioEstatus = false;
    if(!cambio)this.formSeleccionado.get('idEstatusVerificacion')?.setValue(this.estatusPrevio);
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
        const estatusSeleccionado = this.estatusDocumentos.find(o => o.value === idEstatus);
        if (estatusSeleccionado) {
          especialidad.evaluacionEspecialidad.estatusVerificacion.desEstatus = estatusSeleccionado.label;
        }

        return especialidad;
      }
    );

    this.verificacionDocsService.verificarRegistro(solicitud).subscribe({
      next: (respuesta) => {
        if (!respuesta.exito) return;
        this.alertaService.exito(this.mensajes.MSG026);
        this.actualizarRegistro.emit(true);
      },
      error: (error) => {
        this.alertaService.error(error.mensaje);
      }
    })
  }


}
