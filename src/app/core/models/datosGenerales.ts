import { InteresLaboral, InteresLaboralRequest } from "./aspirante";
import { DatosContacto } from "./datosContacto";
import { Residencia } from "./datosDomicilio";
import { DatosPersonales } from "./datosPersonales";
import { Dependientes } from "./dependiente";

export class DatosGeneralesRequest{
    datosPersonales!: DatosPersonales;
    dependientes!: Dependientes;
    datosContacto!: DatosContacto;
    datosResidenciaActual!: Residencia;
    zonasInteresLaboral!:Array<InteresLaboral>;
}