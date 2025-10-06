import { DatosPersonales } from "@models/aspirante"
import { Colonia } from "./colonia";

export class ResidenciaRequest{
    datosPersonales!: DatosPersonales;
    datosResidenciaActual!: Residencia;
       
    
}


export class Residencia{
    colonia!: Colonia;
    nomCalle!: string;
    refNumero!: string;
}