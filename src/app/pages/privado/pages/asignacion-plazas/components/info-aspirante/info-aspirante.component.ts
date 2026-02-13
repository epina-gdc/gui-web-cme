import { Component, inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { Card } from "primeng/card";
import { Avatar } from 'primeng/avatar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CommonModule } from '@angular/common';
import { InfoAspirante, TipoAsignación } from '@models/datosAsignacion';
import { DocumentoService } from '@services/documentos.service';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { TipoDropdown } from '@models/tipo-dropdown.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-info-aspirante',
  imports: [CommonModule, Card, Avatar, DialogModule, ConfirmDialogModule, Select, Button, FormsModule],
  providers: [ConfirmationService],
  templateUrl: './info-aspirante.component.html',
  styleUrl: './info-aspirante.component.scss'
})
export class InfoAspiranteComponent {
  @Input() infoAspirante!: InfoAspirante;
  @Input() tipo!: number;

  documentoService: DocumentoService = inject(DocumentoService);
  confirmacionService: ConfirmationService = inject(ConfirmationService);
  fotoFile!: File | undefined;

  aspirante = {
    fotoUrl: '',
    nombreCompleto: '',
    matricula: '',
    especialidades: [''],
    sexo: '',
    curp: '',
    rfc: '',
    email: '',
    emailAdicional: '',
  };

  visibleRechazo = false;
  loading = false;

  motivos: TipoDropdown[] = [
    { label: 'Mejor oferta en otro lugar', value: 'OTRA_OFERTA' },
    { label: 'Cambio de planes', value: 'CAMBIO_PLANES' },
    { label: 'No me conviene la ubicación', value: 'UBICACION' },
  ];

  motivoSeleccionado: string | null = null;
  

  ngOnInit(): void {
    this.obtenerAspirante();
  }

  ngOnChanges(): void {
    this.obtenerAspirante();
  }

  obtenerAspirante(){
    this.aspirante.nombreCompleto = this.infoAspirante.nombreCompleto;
    this.aspirante.matricula = this.infoAspirante.matriculaFolio;
    this.aspirante.especialidades = this.infoAspirante.especialidades.split(',').map(item => item.trim());
    this.aspirante.sexo = this.infoAspirante.genero ?? '';
    this.aspirante.curp = this.infoAspirante.rfc ?? '';
    this.aspirante.email = this.infoAspirante.correo ?? '';
    this.aspirante.emailAdicional = this.infoAspirante.correoAdicional ?? '';
    this.obtenerFotografia(this.infoAspirante.refFotografia ?? '');
  }

  obtenerFotografia(uuidArchivo: string): void {
    this.documentoService.getFotografia(uuidArchivo).pipe(
    ).subscribe({
      next: (response: any) => {
        //this.selectFile = response;
        const nombreArchivo = 'foto_perfil.png';
        const tipoArchivo = response.type;
        this.fotoFile = new File([response], nombreArchivo, { type: tipoArchivo });
        this.aspirante.fotoUrl = URL.createObjectURL(this.fotoFile);
      }
    });
  }

  rechazarOferta() {
    this.motivoSeleccionado = null;

    this.confirmacionService.confirm({
      key: 'rechazoOferta',
      header: 'Rechazo de oferta',
      message: '', // lo reemplaza el template
      acceptLabel: 'Confirmar Rechazo',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'btn-modal-confirmar',
      rejectButtonStyleClass: 'btn-modal-cancelar',
    });
  }

  cambiarRama() {
    this.confirmacionService.confirm({
      message: '¿Está seguro de asignar un cambio de rama?',
      header: 'Cambio de rama',
      acceptLabel: 'Confirmar cambio de rama',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'btn-modal-confirmar',
      rejectButtonStyleClass: 'btn-modal-cancelar',
      accept: () => {
        this.asignarPlaza(TipoAsignación.CambioRama);
      }
    });
  }

  reimprimirVerificacion() {
    // imprimir / generar PDF
  }

  asignarPlaza(tipo: number)
  {

  }

  cancelarConfirmacion() {
    this.confirmacionService.close(); // cierra el confirmDialog actual
  }

  confirmarRechazo() {
    if (!this.motivoSeleccionado) return;

    // ✅ aquí ya tienes el motivo seleccionado
    console.log('Rechazo con motivo:', this.motivoSeleccionado);

    // aquí llamas tu servicio:
    // this.ofertasService.rechazar({ motivo: this.motivoSeleccionado }).subscribe(...)

    this.confirmacionService.close();
  }


}
