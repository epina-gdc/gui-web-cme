
import { CatPerfil, CatSubperfil } from "./catalogoGeneral";
import { EstadoCivil } from "./estadoCivil";
import { LugarNacimiento } from "./lugarNacimiento";
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
    paisNacimiento!: paisNacimiento;
    sexo!: Sexo;
    lugarNacimiento!: LugarNacimiento;
    estadoCivil!: EstadoCivil;
    refPasaporte!: string;
    perfil!: CatPerfil;
    subperfil!: CatSubperfil;

   
}

export class paisNacimiento{
    idPais!: number;
    nomPaisNacimiento!: string;
}