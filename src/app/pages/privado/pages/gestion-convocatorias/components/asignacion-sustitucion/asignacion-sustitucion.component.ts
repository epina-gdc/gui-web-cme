import { Component, signal, WritableSignal, computed } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Card } from 'primeng/card';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Select } from 'primeng/select';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog'; // <--- Importar Módulo
import { Paginator } from 'primeng/paginator';
import { ConfirmationService } from 'primeng/api'
import { GeneralComponent } from '@components/general.component';

import { TipoDropdown } from '@models/tipo-dropdown.interface';
import { Convocatoria } from '@models/convocatoria.interface';
import { Especialidades } from '@models/especialidad';
import { BusquedaPermisoEspecifico, BusquedaPermisoEspecificoResult } from '@models/asignacion-sustitucion.interface';
import { HttpRespuesta } from '@models/http-respuesta.interface';
import { ConvocatoriaPermisoSustitucion } from '@models/convocatoria.interface';

interface TbConfiguracionAsignacionSustitucion {
  idPermisoSustitucion: number;
  idConvocatoria: number;
  nombreOoad: string;
  zona: string;
  especialidad: string;
  estatus: boolean;
}
@Component({
  selector: 'app-asignacion-sustitucion',
  imports: [
    Card,
    FormsModule,
    ReactiveFormsModule,
    Select,
    ToggleSwitch,
    Button,
    TableModule,
    ConfirmDialogModule,
    Paginator
  ],
  providers: [ConfirmationService],
  templateUrl: './asignacion-sustitucion.component.html',
  styleUrl: './asignacion-sustitucion.component.scss'
})
export class AsignacionSustitucionComponent extends GeneralComponent {
  formAsignacion!: FormGroup;

  first = signal(0);
  rows = signal(10);

  private datosConfiguracionAll = signal<TbConfiguracionAsignacionSustitucion[]>([]);

  totalElementos = computed(() => this.datosConfiguracionAll().length);

  datosConfiguracion = computed(() => {
    const data = this.datosConfiguracionAll();
    const start = this.first();
    const end = start + this.rows();
    return data.slice(start, end);
  });

  optionsOOADS: TipoDropdown[] = [];
  optionsEspecialidades: TipoDropdown[] = [];
  optionsConvocatorias: TipoDropdown[] = [];
  optionsZonas: TipoDropdown[] = [];
  lstConvocatorias: Convocatoria[] = [];

  contratacionEspecifica: BusquedaPermisoEspecificoResult | null = null;
  estadoConvocatoriaPermisoSustitucion: ConvocatoriaPermisoSustitucion | null = null;
  edoGlobalConvocatoria: boolean = false;



  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
  ) {
    super();
    this.formAsignacion = this.inicializarForm();
    this.obtenerCatalogos();
    this.inicializaCambios(this.formAsignacion);
  }

  get sinFiltrosEspecificos(): boolean {
    return !(this.formAsignacion.value.ooad && this.formAsignacion.value.zona && this.formAsignacion.value.especialidad);
  }
  private syncPaginatorToData(): void {
    const total = this.datosConfiguracionAll().length;

    if (total === 0) {
      this.first.set(0);
      return;
    }

    const r = this.rows();
    const f = this.first();

    // Si estás parado en una página que ya no existe (por filtros/actualización)
    if (f >= total) {
      const lastFirst = Math.floor((total - 1) / r) * r;
      this.first.set(lastFirst);
    }
  }
  inicializarForm(): FormGroup {
    return this.fb.group({
      convocatoria: [null],
      limiteContratacionesEspecifica: [null],
      ooad: [null, Validators.required],
      zona: [null, Validators.required],
      especialidad: [null, Validators.required],
      limiteContrataciones: [null],
    })
  }

  inicializaCambios(form: FormGroup) {

    form.controls['ooad'].valueChanges.subscribe(value => {
      this.obtenerZonas(value);
    });

    form.controls['convocatoria'].valueChanges.subscribe(value => {
      console.log('Valor de la convocatoria:', value);
      this.estadoGlobalConvocatoria(form, value);
    });

    form.controls['limiteContratacionesEspecifica'].valueChanges.subscribe(value => {
      console.log('Valor del limiteContratacionesEspecifica:', value);

      let msj = value ? "si desea activar la validación en todas las OOAD's. \n ¿Desea continuar? " : "si desea desactivar la validación en todas las OOAD's. \n ¿Desea continuar?";
      this.confirmacionActivarDesactivar(form, 'limiteContratacionesEspecifica', value ? 1 : 0, msj);
    });

    form.controls['limiteContrataciones'].valueChanges.subscribe(value => {
      console.log('Valor del limiteContrataciones:', value);

      if (this.contratacionEspecifica) {
        let msj = value ? "si desea activar la validación en esta configuración específica. \n ¿Desea continuar? " : "si desea desactivar la validación en esta configuración específica. \n ¿Desea continuar?";
        this.confirmacionActivarDesactivar(form, 'limiteContrataciones', value ? 1 : 0, msj);
      } else {
        this._alertServices.informacion("No se ha seleccionado una configuración específica para activar o desactivar el permiso de sustitución. Por favor, realiza una búsqueda y selecciona una configuración específica antes de activar o desactivar el permiso.");
        form.controls['limiteContrataciones'].setValue(value ? false : true, { emitEvent: false });
      }

    });
  }


  buscar() {
    let filtro: BusquedaPermisoEspecifico = {
      idConvocatoria: this.formAsignacion.value.convocatoria,
      cveOoad: this.formAsignacion.value.ooad,
      desOoad: this.optionsOOADS.find(o => o.value === this.formAsignacion.value.ooad)?.label || '',
      cveZona: this.formAsignacion.value.zona,
      desZona: this.optionsZonas.find(z => z.value === this.formAsignacion.value.zona)?.label || '',
      cveEspecialidad: this.formAsignacion.value.especialidad,
      desEspecialidad: this.optionsEspecialidades.find(e => e.value === this.formAsignacion.value.especialidad)?.label || '',
    }

    console.log("Datos de Busqueda", filtro)

    this.buscarPermisoEspecifico(filtro);

  }

  onPageChange(event: any) {
    this.first.set(event.first);
    this.rows.set(event.rows);
  }

  obtenerCatalogos() {
    forkJoin([
      this._CatalogoGenService.getLstOOADS(),
      this._CatalogoGenService.getLsEspecialidades(),
      this._CatalogoGenService.getLsConvocatorias()
    ]).subscribe(([ooads, especialidades, convicatorias]) => {
      this.optionsOOADS = this.ooadToTipoDropdown(ooads.respuesta);
      this.optionsEspecialidades = this.especialidadesToTipoDropdown(especialidades);
      this.optionsConvocatorias = this.convocatoriasToTipoDropdown(convicatorias.respuesta);
      this.lstConvocatorias = convicatorias.respuesta;
    });
  }

  ooadToTipoDropdown(items: any[]): TipoDropdown[] {
    return items.map(item => ({
      value: item.cveOoad,
      label: item.desOoad
    }));
  }

  especialidadesToTipoDropdown(items: Especialidades[]): TipoDropdown[] {
    return items.map(item => ({
      value: item.cveEspecialidad,
      label: item.desEspecialidad
    }));
  }

  convocatoriasToTipoDropdown(items: Convocatoria[]): TipoDropdown[] {
    return items.map(item => ({
      value: item.idConvocatoria,
      label: item.desConvocatoria
    }));
  }

  zonasToTipoDropdown(items: any[]): TipoDropdown[] {
    return items.map(item => ({
      value: item.cveZona,
      label: item.desZona
    }));
  }

  obtenerZonas(idzona: number) {
    this._CatalogoGenService.getLstZonas(idzona).subscribe((results: HttpRespuesta<any>) => {
      this.optionsZonas = this.zonasToTipoDropdown(results.respuesta);
    });
  }

  buscarPermisoEspecifico(filtro: BusquedaPermisoEspecifico) {
    this._ConvocatoriaService.buscarPermisoEspecifico(filtro)
      .subscribe({
        next: (respuesta: HttpRespuesta<BusquedaPermisoEspecificoResult>) => {

          console.log("Respuesta de la busqueda", respuesta);
          this.contratacionEspecifica = respuesta.respuesta;
          let row: TbConfiguracionAsignacionSustitucion = {
            idPermisoSustitucion: respuesta.respuesta.idPermisoSustitucion,
            idConvocatoria: respuesta.respuesta.idConvocatoria,
            nombreOoad: respuesta.respuesta.desOoad,
            zona: respuesta.respuesta.desZona,
            especialidad: respuesta.respuesta.desEspecialidad,
            estatus: (respuesta.respuesta.indPermisoSustitucion === 1) ? true : false
          }
          this.datosConfiguracionAll.set([row]);
          this.first.set(0);
          this.syncPaginatorToData();

          this.formAsignacion.controls['limiteContrataciones'].setValue((respuesta.respuesta.indPermisoSustitucion === 1) ? true : false, { emitEvent: false });
        },
        error: (error) => {
          this._alertServices.error("Ocurrió un error al realizar la búsqueda. Por favor, inténtalo de nuevo.");
          console.error("Error en la búsqueda", error);
        }
      });

  }

  limpiar() {
    this.formAsignacion.controls['limiteContrataciones'].reset({ value: false }, { emitEvent: false });
    this.formAsignacion.controls['ooad'].reset({ value: null }, { emitEvent: false });
    this.formAsignacion.controls['zona'].reset({ value: null }, { emitEvent: false });
    this.formAsignacion.controls['especialidad'].reset({ value: null }, { emitEvent: false });
    this.datosConfiguracionAll.set([]);
    this.first.set(0);
    this.syncPaginatorToData();
  }

  estadoGlobalConvocatoria(form: FormGroup, idConvocatoria: number) {
    if (idConvocatoria) {
      this._ConvocatoriaService
        .estadoGlobalConvocatoria(idConvocatoria)
        .subscribe((respuesta: HttpRespuesta<ConvocatoriaPermisoSustitucion>) => {
          console.log("Respuesta del estado global de la convocatoria", respuesta);
          let activaDesactivaOOADZonaEspecialidades: boolean = false;
          this.estadoConvocatoriaPermisoSustitucion = respuesta.respuesta;
          respuesta.respuesta.indPermisoSustitucion == 1 ? activaDesactivaOOADZonaEspecialidades = true : activaDesactivaOOADZonaEspecialidades = false;
          form.controls['limiteContratacionesEspecifica'].setValue(activaDesactivaOOADZonaEspecialidades, { emitEvent: false });
          if (!activaDesactivaOOADZonaEspecialidades) {
            this.listaContratacionesEspecificosDesativadas(idConvocatoria);
          }
        });
    } else {
      console.log("No se ha seleccionado una convocatoria");
    }
  }

  actualizacionGeneral(form: FormGroup, indPermisoSustitucion: number) {
    let idConvocatoriaSeleccionada: number = form.controls['convocatoria'].value;
    this._ConvocatoriaService
      .actualizarPermisoGlobalConvocatoria(idConvocatoriaSeleccionada, indPermisoSustitucion)
      .subscribe((respuesta: HttpRespuesta<ConvocatoriaPermisoSustitucion>) => {
        console.log("Respuesta de la actualización global", respuesta);
        //  this.estadoGlobalConvocatoria(this.formAsignacion, idConvocatoria);
        let activaDesactivaOOADZonaEspecialidades: boolean = false;
        this.estadoConvocatoriaPermisoSustitucion = respuesta.respuesta;
        respuesta.respuesta.indPermisoSustitucion == 1 ? activaDesactivaOOADZonaEspecialidades = true : activaDesactivaOOADZonaEspecialidades = false;
        form.controls['limiteContratacionesEspecifica'].setValue(activaDesactivaOOADZonaEspecialidades, { emitEvent: false });
        if (!activaDesactivaOOADZonaEspecialidades) {
          this.listaContratacionesEspecificosDesativadas(idConvocatoriaSeleccionada);
        }
      });
  }

  actualizarPermisoEspecifico(idPermisoEspecifico: number, indPermisoSustitucion: number) {
    this._ConvocatoriaService
      .activarDesactivarPermisoEspecifico(idPermisoEspecifico, indPermisoSustitucion)
      .subscribe((respuesta: HttpRespuesta<any>) => {
        console.log("Respuesta de la actualización específica", respuesta);

        if (this.sinFiltrosEspecificos) {
          this.listaContratacionesEspecificosDesativadas(this.formAsignacion.value.convocatoria);
        } else {
          this.buscar();
        }



      });
  }

  listaContratacionesEspecificosDesativadas(idConvocatoria: number) {
    this._ConvocatoriaService.lstContratacionesEspecificosDesativadas(idConvocatoria)
      .subscribe((results: HttpRespuesta<BusquedaPermisoEspecificoResult[]>) => {
        console.log("Respuesta de la lista de permisos específicos", results);
        if (results.respuesta.length > 0) {

          let rows: TbConfiguracionAsignacionSustitucion[] = results.respuesta.map((item: BusquedaPermisoEspecificoResult) => ({
            idPermisoSustitucion: item.idPermisoSustitucion,
            idConvocatoria: item.idConvocatoria,
            nombreOoad: item.desOoad,
            zona: item.desZona,
            especialidad: item.desEspecialidad,
            estatus: (item.indPermisoSustitucion === 1) ? true : false
          }));

          this.datosConfiguracionAll.set(rows);
          this.first.set(0);
          this.syncPaginatorToData();
        }

      });
  }

  confirmacionActivarDesactivar(form: FormGroup, key: string, value: number, msj: string = '') {

    this.confirmationService.confirm({
      message: msj,
      header: ' ',
      acceptLabel: 'Sí, confirmar',
      rejectLabel: 'Cancelar',
      // IMPORTANTE: Estas clases deben coincidir con el CSS Global
      acceptButtonStyleClass: 'btn-modal-confirmar',
      rejectButtonStyleClass: 'btn-modal-cancelar',
      accept: () => { /* ... */

        if (key === 'limiteContratacionesEspecifica') {

          form.controls['limiteContrataciones'].reset({ value: false, disabled: !value }, { emitEvent: false });
          form.controls['ooad'].reset({ value: null, disabled: !value }, { emitEvent: false });
          form.controls['zona'].reset({ value: null, disabled: !value }, { emitEvent: false });
          form.controls['especialidad'].reset({ value: null, disabled: !value }, { emitEvent: false });
          this.datosConfiguracionAll.set([]);
          this.first.set(0);
          this.syncPaginatorToData();
          this.actualizacionGeneral(form, value);

        }
        if (key === 'limiteContrataciones') {
          if (this.contratacionEspecifica) {
            this.actualizarPermisoEspecifico(this.contratacionEspecifica.idPermisoSustitucion, value);
          }
        }
      },
      reject: () => {
        form.controls[key].setValue(value ? false : true, { emitEvent: false });
        // this.alertService.informacion("El sistema no realiza ningún cambio. Se mantiene la información actual de la cita");
      }
    });
  }
  private setEstatus(idPermisoSustitucion: number, estatus: boolean) {
    this.datosConfiguracionAll.update(list =>
      list.map(r =>
        r.idPermisoSustitucion === idPermisoSustitucion ? { ...r, estatus } : r
      )
    );
  }

  confirmarCambioEstatus(item: TbConfiguracionAsignacionSustitucion, nuevoValor: boolean) {
    const valorAnterior = item.estatus;
    let aplicado = false;

    this.confirmationService.confirm({
      message: nuevoValor
        ? '¿Desea activar el permiso de sustitución para esta configuración específica?'
        : '¿Desea desactivar el permiso de sustitución para esta configuración específica?',
      acceptLabel: 'Sí, confirmar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'btn-modal-confirmar',
      rejectButtonStyleClass: 'btn-modal-cancelar',

      accept: () => {
        aplicado = true;
        this.actualizarPermisoEspecifico(item.idPermisoSustitucion, nuevoValor ? 1 : 0);
        this.setEstatus(item.idPermisoSustitucion, nuevoValor);
      },

      reject: () => this.setEstatus(item.idPermisoSustitucion, valorAnterior),
    });
  }
  /*
    confirmarCambioEstatus(item: TbConfiguracionAsignacionSustitucion, nuevoValor: boolean) {
      const valorAnterior = item.estatus; // lo que tenía antes del click
    
      let msj = nuevoValor
        ? "¿Desea activar el permiso de sustitución para esta configuración específica?"
        : "¿Desea desactivar el permiso de sustitución para esta configuración específica?";
  
      console.log("Configuración seleccionada para cambio de estatus", nuevoValor);
      this.confirmationService.confirm({
        message: msj,
        header: ' ',
        acceptLabel: 'Sí, confirmar',
        rejectLabel: 'Cancelar',
        // IMPORTANTE: Estas clases deben coincidir con el CSS Global
        acceptButtonStyleClass: 'btn-modal-confirmar',
        rejectButtonStyleClass: 'btn-modal-cancelar',
        accept: () => {
          this.actualizarPermisoEspecifico(item.idPermisoSustitucion, nuevoValor ? 1 : 0);
        },
        reject: () => {
          // ✅ revertimos el toggle
          item.estatus = valorAnterior;
          this._alertServices.informacion('El sistema no realiza ningún cambio. Se mantiene la información actual.');
        },
      });
  
    }
  */

  activardesctivar(item: TbConfiguracionAsignacionSustitucion) {
    console.log("Configuración seleccionada para activar/desactivar", item);
    this.confirmationService.confirm({
      message: "¿Desea activar o desactivar el permiso de sustitución para esta configuración específica?",
      header: ' ',
      acceptLabel: 'Sí, confirmar',
      rejectLabel: 'Cancelar',
      // IMPORTANTE: Estas clases deben coincidir con el CSS Global
      acceptButtonStyleClass: 'btn-modal-confirmar',
      rejectButtonStyleClass: 'btn-modal-cancelar',
      accept: () => {
        // Lógica real de activación/desactivación
        // Aquí puedes agregar la lógica para activar o desactivar el permiso de sustitución para esta configuración específica
        // Por ejemplo, podrías llamar a un servicio que se encargue de esta tarea
        // this._ConvocatoriaService.activarDesactivarPermisoEspecifico(idPermisoEspecifico, nuevoValor).subscribe(...);
        this._alertServices.informacion("El sistema ha actualizado la configuración según tu selección.");

      },
      reject: () => {
        // Lógica para revertir el cambio en la interfaz si el usuario cancela
        // Por ejemplo, podrías revertir el estado del toggle switch a su valor anterior
        // this.formAsignacion.controls['limiteContratacionesEspecifica'].setValue(previousValue, { emitEvent: false });
        this._alertServices.informacion("El sistema no realiza ningún cambio. Se mantiene la información actual de la configuración.");
      }
    });
  }


}
