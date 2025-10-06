import { DatosPersonales } from "./aspirante";

export class ContactoRequest{
    datosPersonales!: Array<DatosPersonales>
    datosContacto!: DatosContacto;
}
export class DatosContacto{
    refCorreoAdicional!:string;
    refTelefonoCasa!: string;
    refTelefonoCelular!: string;
}
