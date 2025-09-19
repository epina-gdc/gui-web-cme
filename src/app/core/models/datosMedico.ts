
export class Medico {
    nombre!: string;
    apellidoP!: string;
    apellidoM!: string;
    curp!: string;
    rfc!: string;
    correo!: string;
    password!: string;
    modalidad!: number;
}





export class RegistroMedico extends Medico {
    correo2!: string;
    password2!: string;
    blnPasaporte!: boolean;
    pais!:string;
    pasaporte!: string;
    matricula!: string;
}