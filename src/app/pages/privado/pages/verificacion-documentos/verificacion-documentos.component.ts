import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Component, inject, OnInit, signal, ViewChild, WritableSignal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Card} from 'primeng/card';
import {SelectModule} from 'primeng/select';
import {InputText} from 'primeng/inputtext';
import {PaginatorModule} from 'primeng/paginator';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {TableModule} from 'primeng/table';
import {Popover, PopoverModule} from 'primeng/popover';
import {GeneralComponent} from '../../../../components/general.component';
import {BtnRegresarComponent} from '../../../../components/btn-regresar/btn-regresar.component';
import {TipoDropdown} from '@models/tipo-dropdown.interface';
import {ButtonModule} from 'primeng/button';
import {DUMMIE_TABLA_VERIFICACION_DOCUMENTOS} from '@utils/dummies';
import { mapearArregloTipoDropdown } from '@utils/funciones';
import { VerificacionDocsService } from '@services/verificacion-docs.service';
import { VerificacionDocsInterface } from '@models/verificacion-docs.interface';
import { HttpRespuesta } from '@models/http-respuesta.interface';
import { TablaVerificacionDocsInterface } from '@models/tabla-verificacion-docs.interface';

@Component({
  selector: 'app-verificacion-documentos',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Card,
    SelectModule,
    InputText,
    TableModule,
    ButtonModule,
    ConfirmPopupModule,
    BtnRegresarComponent,
    PaginatorModule,
    PopoverModule
  ],
  templateUrl: './verificacion-documentos.component.html',
  styleUrl: './verificacion-documentos.component.scss',
})
export class VerificacionDocumentosComponent extends GeneralComponent implements OnInit{
  @ViewChild('op') op!: Popover;

  dummies = [{ label: 'Dummie 1', value: 'Dummie 1' }, { label: 'Dummie 2', value: 'Dummie 2' }];
  dummiesTabla = DUMMIE_TABLA_VERIFICACION_DOCUMENTOS;

  verificacionDocsService = inject(VerificacionDocsService);


  filtroForm!: FormGroup;

  usuarioDocumentos: WritableSignal<TablaVerificacionDocsInterface[]> = signal([]);
  documentoSeleccionado: any;
  paginaActual: number = 0;
  first: number = 0;
  totalElementos: number = 0;
  rows: number = 10;

  especialidad: TipoDropdown[] = [];
  estatus: TipoDropdown[] = [];

  clases: Map<number,string> = new Map([
    [1 , 'pendiente'],
    [2 , 'revision'],
    [3 , 'cumple'],
    [4 , 'noCumple']
  ]);

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly fb: FormBuilder)
    {
      super();
      this.filtroForm = this.inicializarForm();
      this.obtenerCatalogos();
  }

  ngOnInit(): void {
    this.paginar();

  }

  obtenerCatalogos(){
    this.activatedRoute.data.subscribe(({respuesta}) => {
      const [especialidades,estatusVerificacion] = respuesta;
      this.especialidad = mapearArregloTipoDropdown(especialidades,'desEspecialidad', 'cveEspecialidad');
      this.estatus = mapearArregloTipoDropdown(estatusVerificacion.respuesta, 'desEstatus','idEstatusVerificacion');
    });
  }

  inicializarForm(): FormGroup {
    return this.fb.group({
      especialidad: [],
      estatus: [],
      matricula: [],
    });
  }

  textoEstatus(estatus: number): string {
    const tipoEstatus:string[] =[
      "No cumple con requisitos",
      "Cumple con requisitos",
      "Revisión documental",
      "Pendiente"
    ];


    return tipoEstatus[estatus];
  }

  settearClase(estatus: number): string {
    return this.clases.get(estatus) ?? '';
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.paginaActual = event.page;
    this.paginar();
  }

  paginar(){
    this.verificacionDocsService.consultarDocs(this.filtros()).subscribe({
      next: (respuesta: HttpRespuesta<any>) => {
        this.usuarioDocumentos.set(respuesta.respuesta['content']);

        //this.first: number = 0;
        this.totalElementos = respuesta.respuesta.page.totalElements;
      }
    })
  }

  filtros(): VerificacionDocsInterface{
    return {
      page: 0,
      size: 10,
      idEstatus: (this.filtroForm.get('estatus')?.value)?.value,
      cveEspecialidad: (this.filtroForm.get('especialidad')?.value)?.value,
      matriculaFolio: this.filtroForm.get('matricula')?.value,

    }
  }


  consultaDocumento(event: any, documento: any){
    if (this.documentoSeleccionado?.matricula === documento.matricula) {
      this.op.hide();
      this.documentoSeleccionado = null;
  } else {
      this.documentoSeleccionado = documento;
      this.op.show(event);

      if (this.op.container) {
          this.op.align();
      }
  }
  }

  hidePopover() {
    this.op.hide();
  }

  irDetalleDocumentacion(){
    this._router.navigate(['privado/',this._nav.documentacionAspirante])
  }

  limpiar(){
    this.filtroForm.reset();
    this.paginar();
    this.paginaActual = 0;
    this.first = 0;
  }


  limpiarObjeto<T extends object>(obj: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, valor]) => valor !== undefined)
    ) as Partial<T>;
  }

}
