import { Component, inject, Input } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { Select } from 'primeng/select';
import {Button} from 'primeng/button';
import { InfoAspirante } from '@models/datosAsignacion';
import { AsignacionPlazaService } from '@services/asignacion-plaza.service';
import { TipoDropdown } from '@models/tipo-dropdown.interface';
import { mapearArregloTipoDropdown } from '@utils/funciones';
import { CatalogosGeneralesService } from '@services/catalogos-generales.service';

@Component({
  selector: 'app-asignacion-sustitucion',
  imports: [CommonModule, ReactiveFormsModule, Select, Button],
  templateUrl: './asignacion-sustitucion.component.html',
  styleUrl: './asignacion-sustitucion.component.scss'
})
export class AsignacionSustitucionComponent {
  @Input() infoAspirante!: InfoAspirante;
  
  asignacionPlazaService: AsignacionPlazaService = inject(AsignacionPlazaService);
  catalogosService: CatalogosGeneralesService = inject(CatalogosGeneralesService);
  
  ooadOptions: TipoDropdown[] = [];
  zonaOptions: TipoDropdown[] = [];
  especialidadOptions: TipoDropdown[] = [];

  asignacionConfirmada = false;

  resumenAsignacion: {
    ooadLabel: string;
    zonaLabel: string;
    especialidadLabel: string;
  } | null = null;

  formSustitucion!: FormGroup;
  default_catalogo: TipoDropdown = {value:0,label:'Seleccione una opción'};

  constructor(private fb: FormBuilder) {}
  
  ngOnInit(): void {
    /*this.formSustitucion = this.fb.group({
      ooad: ['' as string | null, Validators.required],
      zona: ['' as string | null, Validators.required],
      especialidad: ['' as string | null, Validators.required],
    });*/
  }

  ngOnChanges(): void {
    this.formSustitucion = this.fb.group({
      ooad: ['' as string | null, Validators.required],
      zona: ['' as string | null, Validators.required],
      especialidad: ['' as string | null, Validators.required],
    });
    this.getEspecialidades();
    this.getOoad();
  }

  onChangeOoad(){
    this.zonaOptions = [];
    const zonaCtrl = this.formSustitucion.get('zona');
    zonaCtrl?.reset(null);

    zonaCtrl?.updateValueAndValidity({ emitEvent: false });
    this.formSustitucion.updateValueAndValidity({ emitEvent: false });

    this.getOoad();

  }

  getEspecialidades(): void {
    this.asignacionPlazaService.getEspecialidadByMatricula(this.infoAspirante.matriculaFolio).subscribe({
      next: (result) => {
        if (result.exito && Array.isArray(result.respuesta) && result.respuesta.length > 0) {
          this.especialidadOptions = mapearArregloTipoDropdown(result.respuesta, 'label', 'value');
          //this.especialidadList.unshift(this.default_catalogo);
          const idEspecialidad = result.respuesta[0]?.value ?? null;
          this.formSustitucion.get('especialidad')?.patchValue(idEspecialidad);
          return;
        } else{
          this.especialidadOptions = [];
          return;
        }
      }
    })
  }

  getOoad(): void {
    this.catalogosService.getLstOOADS().subscribe({
      next: (result) => {
        console.log('Catalogo', result);
        if (result.exito && Array.isArray(result.respuesta) && result.respuesta.length > 0) {
          this.ooadOptions = mapearArregloTipoDropdown(result.respuesta, 'desOoad', 'cveOoad');
          this.ooadOptions.unshift(this.default_catalogo);
          return;
        } else {
          this.ooadOptions = [];
          return;
        }
      }
    })
  }

  getZonas(): void {
    const idOoad = this.formSustitucion.get('ooad')?.value;
    this.catalogosService.getZonas(idOoad).subscribe({
      next: (result) => {
        console.log('Zonas', result);
        if (result.exito && Array.isArray(result.respuesta) && result.respuesta.length > 0) {
          this.zonaOptions = mapearArregloTipoDropdown(result.respuesta, 'desZona', 'cveZona');
          this.zonaOptions.unshift(this.default_catalogo);
          return;
        } else {
          this.zonaOptions = [];
          return;
        }
      }
    })
  }


  private labelFrom(options: TipoDropdown[], value: string | null): string {
    if (!value) return '';
    return options.find(x => x.value === value)?.label ?? value;
  }

  asignar(): void {
    if (this.formSustitucion.invalid) {
      this.formSustitucion.markAllAsTouched();
      console.log('error');
      return;
    }

    const v = this.formSustitucion.getRawValue();

    this.resumenAsignacion = {
      ooadLabel: this.labelFrom(this.ooadOptions, v.ooad),
      zonaLabel: this.labelFrom(this.zonaOptions, v.zona),
      especialidadLabel: this.labelFrom(this.especialidadOptions, v.especialidad),
    };

    console.log(this.resumenAsignacion);

    this.asignacionConfirmada = true;
  }

  imprimirCedula(): void {
    // Aquí disparas tu endpoint / impresión
    console.log('Imprimir cédula', this.resumenAsignacion);
  }

}
