import { EstadoCivil, LugarNacimiento } from "./aspirante";
import { CatPerfil, CatSubperfil } from "./catalogoGeneral";
import { Sexo } from "./sexo";

export class DatosPersonales{
    idUsuario!: number;
    cveMatricula!: string;
    stpAltaRegistro!: string;
    nomNombre!: string;
    nomApellidoPaterno!: string;
    nomApellidoMaterno!: string;
    refCurp!: string;
    refRfc!: string;
    refNss!: string;
    fecNacimiento!: string;
    paisNacimiento!: number;
    sexo!: Sexo;
    lugarNacimiento!: LugarNacimiento;
    estadoCivil!: EstadoCivil;
    refPasaporte!: string;
    perfil!: CatPerfil;
    subperfil!: CatSubperfil;

   
}

