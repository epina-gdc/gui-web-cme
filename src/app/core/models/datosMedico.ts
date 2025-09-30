import { CatPerfil } from "./catalogoGeneral";

export class Medico {
    nomNombre!: string;
    nomApellidoPaterno!: string;
    nomApellidoMaterno!: string;
    refCurp!: string;
    refRfc!: string;
    refEmail!: string;
    refContrasenaHash!: string;
    modalidad!: number;
    perfil1!: number
    nomPerfil!: string;
perfil!: CatPerfil;
blnInterno!: boolean;


}





export class RegistroMedico extends Medico {
    correo2!: string;
    password2!: string;
    blnPasaporte!: boolean;
    pais!:number;
    pasaporte!: string;
    cveMatricula!: string;
}



export class RegistroInternoRequest {
   refEmail!:string;
   refContrasenaHash!:string;
   idPerfil!: number;
   cveMatricula!:string;
   nomNombre!:string;
   nomApellidoPaterno!:string;
   nomApellidoMaterno!:string;
   refCurp!:string;
   refRfc!:string;


}

export class RegistroCurpRequest {
    refEmail!: string;
    refContrasenaHash!: string;
    idPerfil!: number;
    idSubperfil!: number;
    idDocumentoVerificacion!: number;
    nomNombre!: string;
    nomApellidoPaterno!: string;
    nomApellidoMaterno!: string;
    refCurp!: string;
    refRfc!: string;
 
 
 }

 export class RegistroPasaporteRequest {
    refEmail!: string;
    refContrasenaHash!: string;
    idPerfil!: number;
    idSubperfil!: number;
    idDocumentoVerificacion!: number;
    pasaporte!:string;
    idPaisEmision!: number;
    nomNombre!: string;
    nomApellidoPaterno!: string;
    nomApellidoMaterno!: string;
    refCurp!: string;
    refRfc!: string;


  
 
 
 }