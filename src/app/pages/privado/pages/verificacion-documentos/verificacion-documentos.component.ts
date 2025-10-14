import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Component, OnInit, signal, ViewChild, WritableSignal} from '@angular/core';
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
import {EstatusDocumentacion} from '@models/verificacion-documentos.interface';

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


  filtroForm!: FormGroup;

  usuarioDocumentos: WritableSignal<any[]> = signal([]);
  documentoSeleccionado: any;
  paginaActual: number = 0;
  first: number = 0;
  totalElementos: number = 50;
  rows: number = 10;

  especialidad: TipoDropdown[] = [];
  estatus: TipoDropdown[] = [];
  contratacion: TipoDropdown[] = [];

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
    this.especialidad = this.dummies;
    this.estatus = this.dummies;
    this.contratacion = this.dummies;
  }

  inicializarForm(): FormGroup {
    return this.fb.group({
      especialidad: [],
      estatus: [],
      matricula: [],
      contratacion: [],
    });
  }

  textoEstatus(estatus: number): string {
    return EstatusDocumentacion[estatus];
  }

  settearClase(estatus: number): string {
    const clase = ["noCumple", "cumple", "revision", "pendiente"];
    return clase[estatus];
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.paginaActual = event.page;
    this.paginar();
  }

  paginar(){
    this.usuarioDocumentos.set(this.dummiesTabla);
    //this.totalElementos = this.usuarioDocumentos().length;
  }


  consultaDocumento(event: any, documento: any){
    this.op.show(event);
  }

  hidePopover() {
    this.op.hide();
}


}
