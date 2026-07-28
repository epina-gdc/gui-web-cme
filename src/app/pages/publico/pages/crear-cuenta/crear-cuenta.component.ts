import {Component, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms"; // Import FormsModule
import {Card} from 'primeng/card';
import {Button} from 'primeng/button';
import {Select} from 'primeng/select';
import {RadioButton, RadioButtonModule} from 'primeng/radiobutton';
import {GeneralComponent} from '@components/general.component';
import {CommonModule} from '@angular/common';
import {RegistroMedico} from '@models/datosMedico';
import {
  CatDocumentoVerificacion,
  CatDocVerifResponse,
  CatPerfil,
  CatSubperfil
} from '@models/catalogoGeneral';
import {BtnRegresarComponent} from '@components/btn-regresar/btn-regresar.component';
import {ConvocatoriaActiva, ConvocatoriaPerfil, ConvocatoriaSubperfil} from '@models/convocatoria.interface';
import {HttpRespuesta} from '@models/http-respuesta.interface';
import {
  construirEncabezadoConvocatoriaActiva,
  TITULO_CONVOCATORIA_DEFAULT
} from '@utils/convocatoria-activa';

@Component({
  selector: 'app-crear-cuenta',
  imports: [
    Card,
    Button,
    Select,
    ReactiveFormsModule,
    CommonModule,
    RadioButtonModule,
    FormsModule,
    RadioButton,
    BtnRegresarComponent,
  ],
  standalone: true,
  templateUrl: './crear-cuenta.component.html',
  styleUrl: './crear-cuenta.component.scss'
})
export class CrearCuentaComponent extends GeneralComponent implements OnInit {

  fb = inject(FormBuilder)
  form!: FormGroup;
  blnSeleccionado = false;
  tituloConvocatoria = signal('');
  subtituloConvocatoria = signal('');

  ruta: string = '';
  lstPerfil: Array<CatPerfil> = [];
  lstModalidad: Array<CatSubperfil> = [];
  lstDocumentos: Array<CatDocumentoVerificacion> = [];
  registroMedico!: RegistroMedico;
  blnResidente!: boolean;
  private lstSubperfilesConvocatoria: Array<CatSubperfil> = [];

  private readonly DOCUMENTO_PASAPORTE: string = 'PASAPORTE';

  ngOnInit() {
    this.ruta = this._nav.publico + this._nav.inicioSesion;
    this.registroMedico = new RegistroMedico();
    this.blnResidente = true;
    this.blnSeleccionado = false;
    this.form = this.inicializarForm();
    this.inicializarCambiosFormulario();
    this.obtenerConvocatoriaActiva();
  }

  getCatalogoDocumento(): void {
    this.lstDocumentos = new Array<CatDocumentoVerificacion>();
    this._CatalogoGenService.getLstDocumentosVerificacion().subscribe((response: CatDocVerifResponse) => {
      if (!response.exito) return;
      this.lstDocumentos = response.respuesta;
    });
  }

  inicializarForm(): FormGroup {
    return this.fb.group({
      perfil: ['', [Validators.required]],
      modalidad: ['', ''],
      documento: ['', ''],
    });
  }

  inicializarCambiosFormulario(): void {
    this.form.controls['perfil'].valueChanges.subscribe(() => {
      this.cambiaPerfil();
    });
  }

  public btnAceptar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const documentoVerificacion: string = this.form.controls['documento'].value;

    if (!this.registroMedico.blnInterno) {
      this.registroMedico.desDocumentoVerificacion = documentoVerificacion;

      const documentoEncontrado = this.lstDocumentos.find(
        x => x.desDocumentoVerificacion === documentoVerificacion
      );

      if (documentoEncontrado) {
        this.registroMedico.documentoVerif = documentoEncontrado;
      }

      this.registroMedico.blnPasaporte = documentoVerificacion === this.DOCUMENTO_PASAPORTE;
      // El caso CURP es implícito: si no es PASAPORTE, blnPasaporte debe ser false,
    }

    //console.log("registroMedico es ", this.registroMedico);
    this.saveSession("registroMedico", this.registroMedico);
    void this._router.navigate(['publico/' + this._nav.registroMedico]);
  }


  public cambiaPerfil(): void {
    this.clearCampos();

    this.perfilSeleccionado();
    if (!this.registroMedico.perfil1) {
      this.blnResidente = true;
      this.lstModalidad = [];
      return;
    }

    if (this.registroMedico.blnInterno) {
      this.camposResidente();
    } else {
      this.camposExterno();
    }
    //console.log(this.form);
    //console.log(this.form.valid);
  }

  perfilSeleccionado() {
    this.registroMedico.perfil1 = this.form.controls['perfil'].value;
    const perfil = this.lstPerfil.find((x: { idPerfil: number; }) => x.idPerfil == this.registroMedico.perfil1);

    if (perfil) {
      this.registroMedico.perfil = perfil;
      this.registroMedico.blnInterno = this.esPerfilInterno(perfil);
    }
  }

  private camposResidente() {
    this.clearCampos();
    this.blnResidente = true;
    this.lstModalidad = [];
  }

  private camposExterno() {
    
    this.blnResidente = false;
    this.actualizarModalidadesPorPerfil(this.registroMedico.perfil1);
    if (this.lstModalidad.length > 0) {
      this.form.controls['modalidad'].setValidators([Validators.required]);
      this.form.controls['modalidad'].updateValueAndValidity();
    }
   
    this.getCatalogoDocumento();
 
  
    this.form.controls['documento'].setValidators([Validators.required]);
  
    this.form.controls['documento'].updateValueAndValidity();
  }

  private clearCampos() {
    this.form.controls['modalidad'].setValue(null);
    this.form.controls['modalidad'].setValidators([]);
    this.form.controls['documento'].setValidators([]);
    this.form.controls['modalidad'].updateValueAndValidity();
    this.form.controls['documento'].updateValueAndValidity();
  }

  cambiaModalidad() {
    this.registroMedico.modalidad = this.form.controls['modalidad'].value;
    //console.log("hay cambios en el select ", this.registroMedico);
  }

  get mostrarModalidad(): boolean {
    return !this.blnResidente && this.lstModalidad.length > 0;
  }

  private obtenerConvocatoriaActiva(): void {
    this._CatalogoGenService.getConvocatoriaActiva()
      .subscribe({
        next: (response: HttpRespuesta<ConvocatoriaActiva | undefined>) => {
          if (!response.exito || !response.respuesta) {
            this.establecerConvocatoriaDefault();
            if (response.mensaje) {
              this._alertServices.informacion(response.mensaje);
            }
            return;
          }
          this.establecerConvocatoriaActiva(response.respuesta);
        },
        error: (error) => {
          console.log('Error al consultar convocatoria activa', error);
          this.establecerConvocatoriaDefault();
          this._alertServices.error(error?.error?.mensaje ?? 'No fue posible consultar la convocatoria activa.');
        }
      });
  }

  private establecerConvocatoriaActiva(convocatoria: ConvocatoriaActiva): void {
    const encabezado = construirEncabezadoConvocatoriaActiva(convocatoria);
    this.tituloConvocatoria.set(encabezado.titulo);
    this.subtituloConvocatoria.set(encabezado.subtitulo);
    this.lstPerfil = this.perfilesToCatalogo(convocatoria.perfiles ?? []);
    this.lstSubperfilesConvocatoria = this.subperfilesToCatalogo(convocatoria.subperfiles ?? []);
    this.lstModalidad = [];

    if (this.lstPerfil.length === 1) {
      this.form.controls['perfil'].setValue(this.lstPerfil[0].idPerfil);
      return;
    }

    this.form.controls['perfil'].setValue(null, {emitEvent: false});
  }

  private establecerConvocatoriaDefault(): void {
    const encabezado = construirEncabezadoConvocatoriaActiva();
    this.tituloConvocatoria.set(encabezado.titulo);
    this.subtituloConvocatoria.set(encabezado.subtitulo);
    this.lstPerfil = [];
    this.lstSubperfilesConvocatoria = [];
    this.lstModalidad = [];
    this.form.controls['perfil'].setValue(null, {emitEvent: false});
  }

  private actualizarModalidadesPorPerfil(idPerfil: number): void {
    this.lstModalidad = this.lstSubperfilesConvocatoria.filter(subperfil => subperfil.idPerfil === Number(idPerfil));
  }

  private perfilesToCatalogo(perfiles: ConvocatoriaPerfil[]): CatPerfil[] {
    return perfiles.map(perfil => ({
      idPerfil: perfil.idPerfil,
      nomPerfil: perfil.nomPerfil ?? perfil.desPerfil ?? perfil.descripcion ?? perfil.clave ?? String(perfil.idPerfil),
      indActivo: perfil.indActivo ?? 1,
      indPerfilInterno: perfil.indPerfilInterno,
      desPerfil: perfil.desPerfil ?? perfil.descripcion ?? perfil.nomPerfil,
      clave: perfil.clave,
      descripcion: perfil.descripcion
    }));
  }

  private esPerfilInterno(perfil: CatPerfil): boolean {
    if (perfil.indPerfilInterno !== null && perfil.indPerfilInterno !== undefined) {
      return Number(perfil.indPerfilInterno) === 1;
    }

    return ![3, 6].includes(perfil.idPerfil);
  }

  private subperfilesToCatalogo(subperfiles: ConvocatoriaSubperfil[]): CatSubperfil[] {
    return subperfiles
      .filter(subperfil => subperfil.idPerfil !== null && subperfil.idPerfil !== undefined)
      .map(subperfil => ({
        idSubperfil: subperfil.idSubperfil,
        idPerfil: Number(subperfil.idPerfil),
        nomSubperfil: subperfil.nomSubperfil ?? subperfil.desSubperfil ?? subperfil.descripcion ?? subperfil.clave ?? String(subperfil.idSubperfil),
        indActivo: subperfil.indActivo ?? 1,
        desSubperfil: subperfil.desSubperfil ?? subperfil.descripcion ?? subperfil.nomSubperfil,
        clave: subperfil.clave,
        descripcion: subperfil.descripcion
      }));
  }
}
