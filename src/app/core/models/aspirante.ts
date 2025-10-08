import { CatPerfil, CatSubperfil } from "./catalogoGeneral";
import { DatosPersonales } from "./datosPersonales";
import { InteresEspecialidad } from "./especialidad";
import { InteresOoads, OOAD } from "./ooad";
import { Sexo } from "./sexo";
import { InteresZona } from "./zona";

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



export class  LugarNacimiento {
    idLugarNacimiento!: number;
    desLugarNacimiento!: string;
}

export class EstadoCivil{
    idEstadoCivil!: number;
    desEstadoCivil!: string;
}

