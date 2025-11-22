import {Component, inject} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {DatosGeneralesResponse} from '@models/datosGenerales';
import {TitleCasePipe} from '@angular/common';
import {TableModule} from 'primeng/table';
import {DocumentoService} from '@services/documentos.service';
import {DatosEmpleo, DocumentoConstancia} from '@models/solicitud-guardar-documentacion.interface';
import {DiaSemanaPipe} from '@pipes/dia-semana.pipe';
import {Button} from 'primeng/button';
import {UserService} from '@services/user.service';
import {SesionUser} from '@models/sesion-user.interface';
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs';

interface Especialidad {
  especialidad: string,
  especialidadMedica: string,
  tipoDocumento: string,
  guid: string
}

@Component({
  selector: 'app-modal-validacion-medico',
  imports: [
    TitleCasePipe,
    TableModule,
    DiaSemanaPipe,
    Button,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel
  ],
  templateUrl: './modal-validacion-medico.component.html',
  styleUrl: './modal-validacion-medico.component.scss'
})
export class ModalValidacionMedicoComponent {

  datosGenerales!: DatosGeneralesResponse;
  datosEmpleo!: DatosEmpleo;
  documentosConstancias: DocumentoConstancia[] = [];
  especialidades: Especialidad[] = [];
  documentoService: DocumentoService = inject(DocumentoService);
  userService: UserService = inject(UserService);

  guid_obligatorio_1: string = '';
  guid_obligatorio_2: string = '';
  guid_obligatorio_3: string = '';

  userData: SesionUser | null = null;

  constructor(private readonly config: DynamicDialogConfig,
              public ref: DynamicDialogRef,) {
    this.userService.userData$.subscribe(user => this.userData = user);
    if (this.config.data) {
      this.datosGenerales = this.config.data.datosGenerales;
      this.datosEmpleo = this.config.data.datosEmpleo;
      this.especialidades = this.config.data.especialidadesDocumentos;
      this.documentosConstancias = this.config.data.documentosConstancias;
      const documentosObligatorios = this.config.data.documentosObligatorios;
      if (!documentosObligatorios) return;
      const documento_ob1 = documentosObligatorios.find((d: any) => d.tipoDocumentoObligatorio.idDocumentoObligatorio === 1);
      const documento_ob2 = documentosObligatorios.find((d: any) => d.tipoDocumentoObligatorio.idDocumentoObligatorio === 2);
      const documento_ob3 = documentosObligatorios.find((d: any) => d.tipoDocumentoObligatorio.idDocumentoObligatorio === 3);
      if (documento_ob1) {
        this.guid_obligatorio_1 = documento_ob1.documento.refGuid;
      }
      if (documento_ob2) {
        this.guid_obligatorio_2 = documento_ob2.documento.refGuid;
      }
      if (documento_ob3) {
        this.guid_obligatorio_3 = documento_ob3.documento.refGuid;
      }
    }
  }


  mostrarDocumento(guid: string) {
    this.documentoService.obtenerDocumento(guid).subscribe({
      next: (response: any) => {

        const tipoArchivo = response.type;
        const fileBlob = new Blob([response], {type: tipoArchivo});
        const fileURL = URL.createObjectURL(fileBlob);

        window.open(fileURL, '_blank');
      }
    });
  }

  cancelar(): void {
    this.ref.close();
  }

  finalizar(): void {
    this.ref.close({finalizar: true});
  }

}
