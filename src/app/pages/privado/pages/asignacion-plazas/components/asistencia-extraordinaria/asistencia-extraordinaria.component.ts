import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

// PrimeNG Imports
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {ChipModule} from 'primeng/chip';
import {DividerModule} from 'primeng/divider';
import {ConfirmDialogModule} from 'primeng/confirmdialog'; // <--- Importar Módulo
import {ConfirmationService} from 'primeng/api'; // <--- Importar Servicio
import {ToastModule} from 'primeng/toast'; // Opcional: Para mostrar mensaje de éxito
import {AsistenciaCardComponent} from '@components/asistencia-card/asistencia-card.component';
import {AsistenciaNoteComponent} from '@components/asistencia-note/asistencia-note.component';
import {Fotografia} from '@models/fotografia';
import {DocumentoService} from "@services/documentos.service";
import {AlertService} from '@services/alert.service';
import {AsistenciaExtraordinariaService} from '@services/asistencia-extraordinaria.service';
import {AsistenciaAspirante, AsistenciaExtraordinariaResponse} from '@models/asistencia-extraordinaria.interface';

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
export class AsistenciaExtraordinariaComponent {
    alertService: AlertService = inject(AlertService);
    asistenciaService: AsistenciaExtraordinariaService = inject(AsistenciaExtraordinariaService);
    documentoService: DocumentoService = inject(DocumentoService);

    private readonly MSG073: string = "El médico aspirante no cuenta con un registro previo.";
    private readonly MSG074: string = "El médico aspirante no cuenta con una cita.";
    private readonly MSG075: string = "El médico aspirante no cuenta con cita. ¿Desea registrar su asistencia?.";
    private readonly MSG076: string = "Se realizo con éxito el registro de la asistencia.";
    private readonly MSG077: string = "¿Está seguro de que desea eliminar esta cita?.";

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
    ) { }

    get tieneAsistencia(): boolean {
        return (this.aspirante?.diaAsistenciaCita == null && this.aspirante?.horaAsistencia == null && this.aspirante?.turnoAsistencia == null);
    }

    get tieneCita(): boolean {
        return (this.aspirante?.fechaCita == null && this.aspirante?.horaCita == null && this.aspirante?.turnoCita == null && this.aspirante?.mesaCita == null);
    }
    // búsqueda
    search() {

        if (!this.searchQuery) {
            this.alertService.error("Requiere una matricula o folio");
            return
        };

        this.loading = true;

        this.asistenciaService.busqueda(this.searchQuery).subscribe({
            next: (response: AsistenciaExtraordinariaResponse) => {
                if (response.exito && response.respuesta) {
                    const data = response.respuesta;
                    this.aspirante = response.respuesta;
                    if (this.tieneCita) {
                        this.alertService.informacion(this.MSG073);
                    }
                    if (this.tieneAsistencia) {
                        this.alertService.informacion(this.MSG074);
                    }
                    if (response.respuesta?.uuidArchivo) {
                        this.obtenerFotografia(response.respuesta?.uuidArchivo);
                    }
                } else {
                    this.alertService.error(response.mensaje);
                }
                this.loading = false;
            },
            error: (err) => {
                this.alertService.error('Error en la búsqueda');
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

        this.confirmationService.confirm({
            message: 'El médico aspirante no cuenta con cita. \n ¿Desea registrar su asistencia?',
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
        this.asistenciaService.confimar(idParticipante).subscribe({
            next: (response: AsistenciaExtraordinariaResponse) => {
                if (response.exito && response.respuesta) {
                    this.aspirante = response.respuesta;
                    this.alertService.exito(this.MSG076);
                } else {
                    this.alertService.error(response.mensaje);
                }
            },
            error: (err) => {
                this.alertService.error('Error al confirmar la asistencia');
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
            accept: () => { /* ... */
                // Lógica real de eliminación
                if (this.aspirante) {
                    this.eliminar(this.aspirante.idParticipante.toString());
                } else {
                    console.log('Aspirante no encontrado para registrar asistencia');
                }
            },
            reject: () => {
                this.alertService.informacion("El sistema no realiza ningún cambio. Se mantiene la información actual de la cita");
            }
        });
    }

    eliminar(idParticipante: string) {
        this.asistenciaService.eliminar(idParticipante).subscribe({
            next: (response: AsistenciaExtraordinariaResponse) => {
                if (response.exito) {
                    if (this.aspirante) {
                        this.aspirante.diaAsistenciaCita = null;
                        this.aspirante.horaAsistencia = null;
                        this.aspirante.turnoAsistencia = null;

                        this.alertService.informacion(this.MSG074);

                    }
                } else {
                    this.alertService.error(response.mensaje);
                }
            },
            error: (err) => {
                this.alertService.error('Error al eliminar la cita');
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
