import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {TipoDropdown} from '@models/tipo-dropdown.interface';
import {GeneralComponent} from '@components/general.component';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {AsignacionService} from '@services/asignacion.service';
import {Select} from 'primeng/select';
import {selectData} from '@privado/asignacion-plazas/dummies';
import {InputText} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {PlazaDisponibleCardComponent} from '@components/plaza-disponible-card/plaza-disponible-card.component';
import {FiltroConsultaPlazaInterface} from '@models/filtroConsultaPlaza.interface';
import {
  HeaderMedicoDetalleOfertaComponent
} from '@pages/privado/shared/header-medico-detalle-oferta/header-medico-detalle-oferta.component';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {DetallePlazaComponent} from '@privado/asignacion-plazas/components/detalle-plaza/detalle-plaza.component';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-plaza-ordinaria',
  imports: [
    ReactiveFormsModule,
    PlazaDisponibleCardComponent,
    Select,
    InputText,
    Button,
  ],
  templateUrl: './plaza-ordinaria.component.html',
  styleUrl: './plaza-ordinaria.component.scss',
  providers: [DialogService]
})
export class PlazaOrdinariaComponent extends GeneralComponent implements OnInit{

  asignacionService: AsignacionService = inject(AsignacionService);
  fb: FormBuilder = inject(FormBuilder);
  filtroForm!: FormGroup;

  ref: DynamicDialogRef | undefined;

  especialidadList: TipoDropdown[] = selectData;
  ooadList: TipoDropdown[] = selectData;
  unidadList: TipoDropdown[] = selectData;
  plazasList: WritableSignal<any[]> = signal([]);

  constructor(public dialogService: DialogService){
    super();
  }

  ngOnInit(): void {
    this.filtroForm = this.iniciarForm();
  }


  iniciarForm(): FormGroup {
    return this.fb.group({
      especialidad: [null],
      ooad: [null],
      unidad: [null],
      plaza: [null],
    })
  }

  consultarPlazas(): void {

    this.asignacionService.consultarPlazas(this.objFiltro()).subscribe({
      next: (result) => {
        this.plazasList.set(result);
      }
    })
  }

  objFiltro(): FiltroConsultaPlazaInterface {
    return {
      especialidad: (this.f['especialidad'].value)?.value || null,
      ooad: (this.f['ooad'].value)?.value || null,
      unidad: (this.f['unidad'].value)?.value || null,
      plaza: this.f['plaza'].value
    }
  }

  show(plaza: any){
    this.ref = this.dialogService.open(DetallePlazaComponent, {
      style:{
        'border-bottom': '17px solid #41ABD9',
        'border-radius': '9px'
      },
      data: {...plaza},
      modal: true,
      width: '848px',
      height: '50vh',
      focusOnShow: false,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      templates: {
        header: HeaderMedicoDetalleOfertaComponent
      },
      styleClass: 'oferta-detail'
    });




  }

  get f() {
    return this.filtroForm.controls;
  }

}
