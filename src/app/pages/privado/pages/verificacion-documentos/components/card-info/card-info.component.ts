import {Component, Input,OnInit} from '@angular/core';
import {BtnRegresarComponent} from '@components/btn-regresar/btn-regresar.component';
import {PillComponent} from '@components/pill/pill.component';
import {Card} from 'primeng/card';
import {DetalleDocumentacionDatosPersonales} from '@models/detalleDocumentacionAspirante.interface';
import {TitleCasePipe} from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GeneralComponent } from '@components/general.component';

@Component({
  selector: 'app-card-info',
  imports: [BtnRegresarComponent,
    PillComponent,

    Card, TitleCasePipe],
  templateUrl: './card-info.component.html',
  styleUrl: './card-info.component.scss'
})
export class CardInfoComponent  extends GeneralComponent  implements OnInit {
  @Input() datosPersonales!: DetalleDocumentacionDatosPersonales;

  ruta:string;
  datosFoto!: any;
  selectFile!: File | undefined;
  defaultFile!: SafeResourceUrl | undefined;
  constructor(    private sanitizer: DomSanitizer) {
    super()
   this.ruta = this._nav.privado+this._nav.verificacionDocumentos;

  }
  ngOnInit(){
    console.log("---",this.datosPersonales);
    this.obtenerDatosFoto(this.datosPersonales.idUsuario);
  }

  obtenerDatosFoto(idusuario: number | undefined): void {
    if (!idusuario) return;
    this._ConvocatoriaService.getDatosFotografia(idusuario).subscribe({
      next: (response: any) => {
        if (!response.exito) return;
        this.datosFoto = response.respuesta.fotografia;
        this.obtenerFotografia()
      }
    });
  }

  obtenerFotografia(): void {
    if (!this.datosFoto) return;
    this.documentoService.getFotografia(this.datosFoto.documento.refGuid).pipe(
    ).subscribe({
      next: (response: any) => {
        
        this.selectFile = response;
        const nombreArchivo = 'foto_perfil.png';
        const tipoArchivo = response.type;
 const blob= new Blob([response],  {type: 'blob'});
 this.defaultFile = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
      }
    });
  }

}
