import {Component, inject, Input, OnInit, signal, WritableSignal} from '@angular/core';
import {GeneralComponent} from '@components/general.component';
import {AsignacionService} from '@services/asignacion.service';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {TipoDropdown} from '@models/tipo-dropdown.interface';
import {selectData} from '@privado/asignacion-plazas/dummies';
import {FiltroConsultaPlazaInterface} from '@models/filtroConsultaPlaza.interface';
import {DetallePlazaComponent} from '@privado/asignacion-plazas/components/detalle-plaza/detalle-plaza.component';
import {
  HeaderMedicoDetalleOfertaComponent
} from '@pages/privado/shared/header-medico-detalle-oferta/header-medico-detalle-oferta.component';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {PlazaDisponibleCardComponent} from '@components/plaza-disponible-card/plaza-disponible-card.component';
import {Select} from 'primeng/select';
import { InfoAspirante } from '@models/datosAsignacion';

@Component({
  selector: 'app-coplamar',
  imports: [
    Button,
    InputText,
    PlazaDisponibleCardComponent,
    ReactiveFormsModule,
    Select
  ],
  templateUrl: './coplamar.component.html',
  styleUrl: './coplamar.component.scss',
  providers: [DialogService]
})
export class CoplamarComponent extends GeneralComponent implements OnInit {
  @Input() infoAspirante!: InfoAspirante;

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
