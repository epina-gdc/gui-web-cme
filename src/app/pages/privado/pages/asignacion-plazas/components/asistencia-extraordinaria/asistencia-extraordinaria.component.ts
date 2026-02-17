import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// PrimeNG Imports
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { ConfirmDialogModule } from 'primeng/confirmdialog'; // <--- Importar Módulo
import { ConfirmationService } from 'primeng/api'; // <--- Importar Servicio
import { ToastModule } from 'primeng/toast'; // Opcional: Para mostrar mensaje de éxito
// Componentes e Interfaces
import { GeneralComponent } from '@components/general.component';
import { AsistenciaCardComponent } from '@components/asistencia-card/asistencia-card.component';
import { AsistenciaNoteComponent } from '@components/asistencia-note/asistencia-note.component';
import { Fotografia } from '@models/fotografia';
import { AsistenciaAspirante, AsistenciaExtraordinariaResponse } from '@models/asistencia-extraordinaria.interface';

// Interfaz para los datos del médico
@Component({
    selector: 'app-asistencia-extraordinaria',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        InputTextModule,
        ButtonModule,
        CardModule,
        ChipModule,
        DividerModule,
        ConfirmDialogModule, // <--- Agregar a imports
        ToastModule, // Opcional
        AsistenciaCardComponent,
        AsistenciaNoteComponent
    ],
    providers: [ConfirmationService],
    templateUrl: './asistencia-extraordinaria.component.html',
    styleUrls: ['./asistencia-extraordinaria.component.scss']
})
export class AsistenciaExtraordinariaComponent extends GeneralComponent {

    private readonly MSG073: string = "El médico aspirante no cuenta con un registro previo.";
    private readonly MSG074: string = "El médico aspirante no cuenta con una cita.";
    private readonly MSG075: string = "El médico aspirante no cuenta con cita. \n ¿Desea registrar su asistencia?.";
    private readonly MSG076: string = "Se realizo con éxito el registro de la asistencia.";
    private readonly MSG077: string = "¿Está seguro de que desea eliminar esta asistencia?.";
    private readonly MSG0X1: string = "Ya cuentas con un registro de asistencia.";

    private readonly MSG0E1: string = "Error al confirmar la asistencia.";


    searchQuery: string = '';
    aspirante: AsistenciaAspirante | null = null;
    loading: boolean = false;

    foto!: any;
    archivoFoto!: File;
    selectFile!: File | undefined;
    defaultFile!: File | undefined;
    datosFoto!: Fotografia;

    constructor(
        private confirmationService: ConfirmationService,

    ) {
        super();
    }

    get noTieneAsistencia(): boolean {
        return (this.aspirante?.diaAsistenciaCita === null && this.aspirante?.horaAsistencia === null && this.aspirante?.turnoAsistencia === null);
    }

    get noTieneCita(): boolean {
        return (this.aspirante?.fechaCita === null && this.aspirante?.horaCita === null && this.aspirante?.turnoCita === null && this.aspirante?.mesaCita === null);
    }
    // búsqueda
    search() {

        if (!this.searchQuery) {
            this._alertServices.error("Requiere una matricula o folio");
            return
        };

        this.loading = true;

        this._AsistenciaService.busqueda(this.searchQuery).subscribe({
            next: (response: AsistenciaExtraordinariaResponse) => {
                if (response.exito && response.respuesta) {
                    const data = response.respuesta;
                    this.aspirante = response.respuesta;
                    if (!this.noTieneAsistencia) {
                        this._alertServices.informacion(this.MSG0X1);
                    } else if (this.noTieneCita) {
                        this._alertServices.informacion(this.MSG074);
                    }

                    if (response.respuesta?.uuidArchivo) {
                        this.obtenerFotografia(response.respuesta?.uuidArchivo);
                    }
                } else {
                    this._alertServices.alerta(response.mensaje);
                }
                this.loading = false;
            },
            error: (err) => {
                this._alertServices.error('Error en la búsqueda');
                this.loading = false;
            }
        });

    }

    clear() {
        this.searchQuery = '';
        this.aspirante = null;
        this.foto = null;
    }

    register() {
        let mensaje = "¿Desea registrar su asistencia?";
        if (this.noTieneCita) {
            mensaje = this.MSG075;
        }
        this.confirmationService.confirm({
            message: mensaje,
            header: ' ',
            acceptLabel: 'Sí, confirmar',
            rejectLabel: 'Cancelar',
            // IMPORTANTE: Estas clases deben coincidir con el CSS Global
            acceptButtonStyleClass: 'btn-modal-confirmar',
            rejectButtonStyleClass: 'btn-modal-cancelar',
            accept: () => { /* ... */
                // Lógica real de registro
                if (this.aspirante) {
                    this.confirmar(this.aspirante.idParticipante.toString());
                } else {
                    console.log('Aspirante no encontrado para registrar asistencia');
                }
            }
        });

    }

    confirmar(idParticipante: string) {
        this._AsistenciaService.confimar(idParticipante).subscribe({
            next: (response: AsistenciaExtraordinariaResponse) => {
                if (response.exito && response.respuesta) {
                    this.aspirante = response.respuesta;
                    this._alertServices.exito(response.mensaje);
                } else {
                    this._alertServices.error(response.mensaje);
                }
            },
            error: (err) => {
                this._alertServices.error(this.MSG0E1);
            }
        });
    }

    delete() {

        this.confirmationService.confirm({
            message: this.MSG077,
            header: ' ',
            acceptLabel: 'Sí, confirmar',
            rejectLabel: 'Cancelar',
            // IMPORTANTE: Estas clases deben coincidir con el CSS Global
            acceptButtonStyleClass: 'btn-modal-confirmar',
            rejectButtonStyleClass: 'btn-modal-cancelar',
            accept: () => {
                // Lógica real de eliminación
                if (this.aspirante) {
                    this.eliminar(this.aspirante.idParticipante.toString());
                } else {
                    console.log('Aspirante no encontrado para registrar asistencia');
                }
            },
            reject: () => {

            }
        });
    }

    eliminar(idParticipante: string) {
        this._AsistenciaService.eliminar(idParticipante).subscribe({
            next: (response: AsistenciaExtraordinariaResponse) => {
                if (response.exito) {
                    if (this.aspirante) {
                        this.aspirante.diaAsistenciaCita = null;
                        this.aspirante.horaAsistencia = null;
                        this.aspirante.turnoAsistencia = null;
                        if (this.noTieneCita) {
                            this._alertServices.informacion(this.MSG074);
                        }

                    }
                } else {
                    this._alertServices.error(response.mensaje);
                }
            },
            error: (err) => {
                this._alertServices.error('Error al eliminar la cita');
            }
        });
    }

    obtenerFotografia(uuidArchivo: string): void {

        this.documentoService.getFotografia(uuidArchivo).pipe(
        ).subscribe({
            next: (response: any) => {
                this.selectFile = response;
                const nombreArchivo = 'foto_perfil.png';
                const tipoArchivo = response.type;
                this.defaultFile = new File([response], nombreArchivo, { type: tipoArchivo });
                this.foto = URL.createObjectURL(this.defaultFile);
            }
        });
    }



}
