export class AsignacionRequest{
    idUsuario!:number;
    //1=PLAZA ORDINARIA, 2=PLAZA COPLAMAR, 3=SUSTITUCIÓN 08, 4=CAMBIO DE RAMA, 5=RECHAZO DE OFERTA
    idTipoAsignacionPlaza!:number;
    idPlaza?:number;
    idMotivoRechazo?:number;
    cveOoad?:string;
    desOoad?:string;
    cveZona?:string;
    desZona?:string;
    cveEspecialidad?:string;
    desEspecialidad?:string;
}

export class DisponiblesRequest {
    cveEspecialidad!:string;
    cveOoad!:string;
    cveUnidad!:string;
    numPlaza!:number;
    regimen!:number;
}

export class BusquedaResponse {
    datosGenerales?:InfoAspirante;
    asignacionMedico?: AsignacionPlaza;
}

export class InfoAspirante {
    idUsuario!:number;
    refFotografia?:string;
    idPerfil!:number;
    nombreCompleto!:string;
    matriculaFolio!:string;
    matricula?:string;
    folio?:string;
    especialidades!:string;
    especialidadesClaves?:string;
    idEstatusValidacion!:number;
    estatusValidacion?:string;
    genero?:string;
    curp?:string;
    rfc?:string;
    correo?:string;
    correoAdicional?:string;
    idTipoConvocatoria!:number;
    tipoConvocatoria!:string;
}

export class AsignacionPlaza {
    id?:number;
    idTipoAsignacion?:Asignacion;
    idPlazaLayout?:Plaza
    idMotivoRechazo?:MotivoRechazo;
    idSustitucion?:Sustitucion;
    stpAsignacion?:number;
}

export class Asignacion {
    id!:number;
    desTipoAsignacion!:string;
}

export class Plaza {
    idPlaza!:number;
    cveOoad?:string;
    cvePuesto?:string;
    cveUnidad?:string;
    porcAltoCostoVida?:string;
    especialidad?:string;
    categoria?:string;
    regimen?:string;
    turno?:string;
    tipoPlaza?:string;
    marcaOcupacion?:string;
    umf?:string;
    nuevoHospital?:number;
    ubicacion?:string;
    zona?:string;
    direccion?:string;
    sueldoMensualBruto?:number;
    sueldoMensualNeto?:number;
    horario?:string;
    numPlaza?:string;
    clasificacion?:string;
    ooad?:string;
    creditos?:number;
    bonoDificilCobertura?:number;
    accesoCredito?:boolean;
    creditoAutomotriz?:number;
    descuentoQuincenalCreditoAutomotriz?:number;
    creditoHipotecario?:number;
    descuentoQuincenalCreditoHipotecario?:number;
    esFavorita?:boolean;
    cveZona?:number;
}

export class Sustitucion {
    id!:number;
    cveOoad!:string;
    desOoad!:string;
    cveZona!:string;
    desZona!:string;
    cveEspecialidad!:string;
    desEspecialidad!:string;
}

export class MotivoRechazo {
    id!:number;
    desMotivo!:string;
}

export interface Cedula {
    nombreAdjunto: string;
    adjunto: string; 
}

export interface CedulaResponse {
    exito: boolean;
    mensaje: string;
    respuesta: Cedula; 
}


export const TipoAsignacion = {
    PlazaOrdinaria: 1,
    PlazaCoplamar: 2,
    Sustitucion08: 3,
    CambioRama: 4,
    RechazoOferta: 5
} as const;

export const Regimen ={
    PlazaOrdinaria: 1,
    Complamar: 2
} as const;