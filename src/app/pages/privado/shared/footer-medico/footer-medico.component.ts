import {Component, inject, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {ConvocatoriaService} from '@services/convocatoria.service';
import {DocumentoService} from '@services/documentos.service';
import {UserService} from '@services/user.service';
import {SesionUser} from '@models/sesion-user.interface';
import {TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-footer-medico',
  imports: [
    TitleCasePipe
  ],
  templateUrl: './footer-medico.component.html',
  styleUrl: './footer-medico.component.scss'
})
export class FooterMedicoComponent implements OnInit {

  nombreFoto!: string;
  datosFoto!: any;
  defaultFile!: SafeResourceUrl | undefined;

  convocatoriaService: ConvocatoriaService = inject(ConvocatoriaService);
  documentoService: DocumentoService = inject(DocumentoService);
  userService: UserService = inject(UserService);

  sesion: SesionUser | null = null;

  constructor(private readonly sanitizer: DomSanitizer) {
    this.userService.userData$.subscribe(user => this.sesion = user);
  }

  ngOnInit() {
    if (this.sesion?.idUsuario) {
      this.obtenerDatosFoto(this.sesion.idUsuario);
    }
  }

  obtenerDatosFoto(idusuario: number | undefined): void {
    if (!idusuario) return;
    this.convocatoriaService.getDatosFotografia(idusuario).subscribe({
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
        let extension = ['png', 'jpeg', 'jpg'];
        if (extension.includes(this.datosFoto.documento.refExtension.toLowerCase())) {
          this.nombreFoto = this.datosFoto.documento.refNombre;
          const blob = new Blob([response], {type: 'blob'});
          this.defaultFile = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
        } else {
          this.nombreFoto = 'Sin foto'
        }
      }
    });
  }
}
