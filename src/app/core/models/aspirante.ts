import {DatosPersonales} from "./datosPersonales";
import {InteresEspecialidad} from "./especialidad";
import {InteresOoads} from "./ooad";
import {InteresZona} from "./zona";

export class AspiranteRequest {
    idUsuarioAspirante!: number;
    estatusVerificacion!: Array<EstatusVerificacion>;
    refObservaciones!: string;
}


export class EstatusVerificacion {
    idEstatusVerificacion!: number;
    desEstatus?:string;
}



export class InteresLaboralRequest {
    datosPersonales!: DatosPersonales;
    interesEspecialidad!: InteresEspecialidad;
    interesOoads!: InteresOoads;
    interesZonas!: InteresZona;

}


export class InteresLaboral{
    ooad!: InteresOoads;
    zona!: InteresZona;
}





