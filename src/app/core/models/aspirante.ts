import { InteresEspecialidad } from "./especialidad";
import { InteresOoads, OOAD } from "./ooad";
import { InteresZona } from "./zona";

export class AspiranteRequest {
    idUsuarioAspirante!: number;
    estatusVerificacion!: Array<EstatusVerificacion>;
    refObservaciones!: string;
}


export class EstatusVerificacion {
    idEstatusVerificacion!: number;
}


export class DatosPersonales {
    idUsuario!: number;
}

export class InteresLaboralRequest {
    datosPersonales!: Array<DatosPersonales>
    interesEspecialidad!: Array<InteresEspecialidad>;
    interesOoads!: Array<InteresOoads>;
    interesZonas!: Array<InteresZona>;

}





