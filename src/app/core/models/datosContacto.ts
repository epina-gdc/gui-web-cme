
import {  LugarNacimiento } from "./aspirante";
import { Participacion } from "./datosDocumento";
import { DatosPersonales } from "./datosPersonales";
import { ResponseGeneral } from "./responseGeneral";

export class ContactoRequest{
    datosPersonales!: DatosPersonales;
    datosContacto!: DatosContacto;
}
export class DatosContacto{
    idDatoContacto!: number;
    refCorreoAdicional!:string;
    refTelefonoCasa!: string;
    refTelefonoCelular!: string;
    refEmail!: string;
    paisNacimiento: any;
    lugarNacimiento!: LugarNacimiento;
}



export class DatosContactoResponse {
    participacion!: Participacion;
    datosPersonales!:DatosPersonales;
    datosContacto!: DatosContacto;
   
}

export class DataContacto extends ResponseGeneral{
    respuesta!: DatosContactoResponse;
}