import {Component, computed, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TipoDropdown} from '@models/tipo-dropdown.interface';
import {GeneralComponent} from '@components/general.component';
import {DatePickerModule} from 'primeng/datepicker';
import {Select} from 'primeng/select';
import {Button} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {ActivatedRoute} from '@angular/router';
import {mapearArregloTipoDropdown} from '@utils/funciones';
import {TableroInformacionService} from '@services/tablero-informacion.service';
import {Asistencia, TableroAsistenciaInterface} from '@models/tableroAsistencia.interface';
import dayjs from 'dayjs';
import {NgClass} from '@angular/common';
import {saveAs} from 'file-saver';
import {Subscription, timer} from 'rxjs';

@Component({
  selector: 'app-tablero-informacion-asistencia',
  imports: [
    DatePickerModule,
    ReactiveFormsModule,
    Select,
    Button,
    CardModule,
    NgClass
  ],
  templateUrl: './tablero-informacion-asistencia.component.html',
  styleUrl: './tablero-informacion-asistencia.component.scss'
})
export class TableroInformacionAsistenciaComponent extends GeneralComponent implements OnInit, OnDestroy {

  filtroForm!: FormGroup;
  private contadorTiempo: Subscription | undefined;

  catalogoTurno: WritableSignal<TipoDropdown[]> = signal([]);
  catalogoAsistencia: WritableSignal<TipoDropdown[]> = signal([]);
  asistencia: WritableSignal<TableroAsistenciaInterface> = signal({
    asistenciaIntExt: [],
    diaTurnoAsistenciaCita: [],
    asistenciaCitaPorHora: [],
    diaTurnoAsistenciaExtraordinaria: [],
    asistenciaExtraordinariaPorHora: []
  });
  fechaSeleccionada: WritableSignal<string | null> = signal(null);

  asistenciaCitaPorHora = computed(() => {
    /* Agrupar turnos  CITA*/
    const data = this.asistencia().asistenciaCitaPorHora;
    const arrCitaHoraTurno: Asistencia[][] = [];
    let turnoBase = data[0]?.desTurno;
    let contadorTurnos;

    contadorTurnos = data.filter(x => x.desTurno == turnoBase);

    for (let i = 0; i < data.length; i += contadorTurnos.length) {
      arrCitaHoraTurno.push(data.slice(i, i + contadorTurnos.length));
    }

    return arrCitaHoraTurno;
  });

  asistenciaExtraordinariaPorHora = computed(() => {
    /*Agrupar turnos EXTRAORDINARIO*/
    const data = this.asistencia().asistenciaExtraordinariaPorHora;
    const resultado: Asistencia[][] = [];
    let turnoBase = data[0]?.desTurno;
    let contadorTurnos;

    contadorTurnos = data.filter(x => x.desTurno == turnoBase);

    for (let i = 0; i < data.length; i += contadorTurnos.length) {
      resultado.push(data.slice(i, i + contadorTurnos.length));
    }

    return resultado;
  });

  totalAsistenciaCitas = computed(() => {
    const medicos = this.asistencia().diaTurnoAsistenciaCita;
    let contador = 0;

    medicos.forEach(medico => {
      if (medico.conteo > 0) contador += medico.conteo;
    })

    return contador;
  });

  totalAsistenciaExtraordinaria = computed(() => {
    const medicos = this.asistencia().diaTurnoAsistenciaExtraordinaria;
    let contador = 0;

    medicos.forEach(medico => {
      if (medico.conteo > 0) contador += medico.conteo;
    })

    return contador;
  });

  consultaPorCita: WritableSignal<boolean> = signal(false);
  consultaExtraordinaria: WritableSignal<boolean> = signal(false);


  fechaActual = new Date();
  minDate: Date = this.fechaActual;
  maxDate: Date = this.fechaActual;


  catalogoConvocatorias: any;

  diaTurno: Map<string, string> = new Map([
    ["Turno 1", "dia-primer-turno"],
    ["Turno 2", "dia-segundo-turno"],
    ["Turno 3", "dia-tercer-turno"],
    ["Turno 4", "dia-cuarto-turno"],
    ["Turno 5", "dia-quinto-turno"],
  ]);

  horaTurno: Map<string, string> = new Map([
    ["1", "primer-horario"],
    ["2", "segundo-horario"],
    ["3", "tercer-horario"],
    ["4", "cuarto-horario"],
    ["5", "quinto-horario"],
  ]);

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private tableroInformacionService: TableroInformacionService
  ) {
    super();
  }

  ngOnInit(): void {
    this.filtroForm = this.inicializarForm();

    this.activatedRoute.data.subscribe(({catalogos}) => {
      const defaultValue = {label: "Selecciona opción", value: null};
      this.catalogoAsistencia.set(mapearArregloTipoDropdown(catalogos[0].respuesta, 'desTipoAsistencia', 'idTipoAsistencia'))
      this.catalogoTurno.set(mapearArregloTipoDropdown(catalogos[1].respuesta, 'desTurno', 'idTurno'));

      this.catalogoAsistencia.update(actual => [defaultValue, ...actual]);
      this.catalogoTurno.update(actual => [defaultValue, ...actual]);

      this.catalogoConvocatorias = catalogos[2].respuesta.find((convocatoria: any) => convocatoria.indActivo == 1)
      this.minDate = dayjs(this.catalogoConvocatorias.fecInicio).toDate();
      this.maxDate = dayjs(this.catalogoConvocatorias.fecFin).toDate();
    });

    this.contadorTiempo = timer(0, 180000).subscribe(() => {
      this.buscar();
    });

  }

  inicializarForm(): FormGroup {
    return this.fb.group({
      fecha: ['',[Validators.required]],
      turno: ['',[Validators.required]],
      tipoAsistencia: ['',[Validators.required]],
    })
  }

  buscar(descargarExcel: boolean = false) {

    const objBusqueda = this.objConsulta();

    this.consultaPorCita.set(Number(objBusqueda.idTipoAsistencia) == 1 || objBusqueda.idTipoAsistencia == null)
    this.consultaExtraordinaria.set(Number(objBusqueda.idTipoAsistencia) == 2 || objBusqueda.idTipoAsistencia == null)

    this.tableroInformacionService.buscarInformacion(objBusqueda.fecha, objBusqueda.idTurno, objBusqueda.idTipoAsistencia)
      .subscribe({
        next: (respuesta) => {
          if (respuesta.exito) {
            this.asistencia.set(respuesta.respuesta);
            this.fechaSeleccionada.set(objBusqueda.fecha || null);

            if(descargarExcel){
              const asistenciaCitaPorHora = this.asistencia().asistenciaCitaPorHora.find(i => {
                return i.conteo > 0;
              });
              const asistenciaExtraordinariaPorHora = this.asistencia().asistenciaExtraordinariaPorHora.find(i => {
                return i.conteo > 0;
              });
              const diaTurnoAsistenciaCita = this.asistencia().diaTurnoAsistenciaCita.find(i => {
                return i.conteo > 0;
              });
              const diaTurnoAsistenciaExtraordinaria = this.asistencia().diaTurnoAsistenciaExtraordinaria.find(i => {
                return i.conteo > 0;
              });
              if( asistenciaCitaPorHora ||
                  asistenciaExtraordinariaPorHora ||
                  diaTurnoAsistenciaCita ||
                  diaTurnoAsistenciaExtraordinaria
              ){
                  this.descargarExcel();
              }else{
                this._alertServices.alerta("No existen registros");
              }
            }
          }
        }
      });
  }

  descargarExcel() {
    const objExcel = this.objConsulta();

    this.tableroInformacionService.descargarExcel(objExcel.fecha, objExcel.idTurno, objExcel.idTipoAsistencia)
      .subscribe({
        next: (excelBlob: Blob) => {
          const nombreArchivo = 'DATOS_CONTEO_ASISTENCIAS.xlsx';
          saveAs(excelBlob, nombreArchivo);
        },
        error: (error) => {
          console.error('Error al descargar el Excel:', error);
          this._alertServices.error('Error al descargar el Excel');
        }
      });
  }

  objConsulta(): { fecha: string | null, idTurno: string | null, idTipoAsistencia: string | null } {
    return {
      fecha: this.f['fecha'].value ? dayjs(this.f['fecha'].value).format('YYYY-MM-DD') : dayjs(this.fechaActual).format('YYYY-MM-DD'),
      idTurno: this.f['turno'].value?.value ? this.f['turno'].value.value : null,
      idTipoAsistencia: this.f['tipoAsistencia'].value?.value ? this.f['tipoAsistencia'].value.value : null
    }
  }


  limpiar() {
    this.filtroForm.reset();
    this.buscar();
  }

  claseDiaTurno(turno: string): string {

    let existeClase: boolean = false;
    let clases = [];
    const codigoClaseDefecto = 'Turno 5';

    for (const clave of this.diaTurno.keys()) {
      clases.push(clave)
    }

    const clase = clases.find(x => x == turno);
    if (clase) existeClase = true;

    return existeClase ? this.diaTurno.get(turno) || "" : this.diaTurno.get(codigoClaseDefecto) || "";
  }

  claseHoraTurno(turno: string): string {
    let existeClase: boolean = false;
    let clases = [];
    const codigoClaseDefecto = '5';

    for (const clave of this.horaTurno.keys()) {
      clases.push(clave)
    }

    const clase = clases.find(x => x == turno);

    if (clase) existeClase = true;


    return existeClase ? this.horaTurno.get(turno) || "" : this.horaTurno.get(codigoClaseDefecto) || "";
  }

  get f() {
    return this.filtroForm.controls;
  }

  ngOnDestroy() {
    this.contadorTiempo?.unsubscribe();
  }

}
