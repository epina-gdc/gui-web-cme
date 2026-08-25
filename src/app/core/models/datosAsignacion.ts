export class AsignacionRequest{
    idUsuario!:number;
    //1=PLAZA ORDINARIA, 2=PLAZA COPLAMAR, 3=SUSTITUCIÓN 08, 4=CAMBIO DE RAMA, 5=RECHAZO DE OFERTA
    idTipoAsignacionPlaza!:number;
    idPlaza?:number;
    idMotivoRechazo?:number;
    idParticipacion?:number;
    cveOoad?:string;
    desOoad?:string;
    cveZona?:string;
    desZona?:string;
    cveEspecialidad?:string;
    desEspecialidad?:string;
}

export class DisponiblesRequest {
    cveEspecialidad!:string;
    cveOoad?:string;
    cveUnidad?:string;
    numPlaza?:number;
    regimen!:number;
    cveZona?:string;
    cveTurno?:string;
    cveMarcaOcupacion?:string;
    cveHorario?:string;
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
    indPerfilInterno?: number;
    idParticipacion?: number;
    idOrigenParticipacion?: number;
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

export const OrigenParticipacion = {
    Siap: 2
} as const;

export function agregarIdParticipacionSiap(request: AsignacionRequest, aspirante?: InfoAspirante | null): AsignacionRequest {
    const idParticipacion = obtenerNumero(aspirante?.idParticipacion);

    if (esOrigenParticipacionSiap(aspirante) && idParticipacion !== null) {
        return {
            ...request,
            idParticipacion
        };
    }

    return request;
}

export function esOrigenParticipacionSiap(aspirante?: InfoAspirante | null): boolean {
    return obtenerNumero(aspirante?.idOrigenParticipacion) === OrigenParticipacion.Siap;
}

function obtenerNumero(value: number | string | null | undefined): number | null {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    const numberValue = Number(value);
    return Number.isNaN(numberValue) ? null : numberValue;
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
