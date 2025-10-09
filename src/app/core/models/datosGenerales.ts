import { InteresLaboral, InteresLaboralRequest } from "./aspirante";
import { DatosContacto } from "./datosContacto";
import { Residencia } from "./datosDomicilio";
import { DatosPersonales } from "./datosPersonales";

export class DatosGeneralesRequest{
    datosPersonales!: DatosPersonales;
    dependientes!: any;
    datosContacto!: DatosContacto;
    datosResidenciaActual!: Residencia;
    zonasInteresLaboral!: InteresLaboral
}