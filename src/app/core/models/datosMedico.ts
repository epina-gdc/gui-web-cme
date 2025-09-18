
export class Medico {
    nombre!: string;
    apellidoP!: string;
    apellidoM!: string;
    curp!: string;
    rfc!: string;
    correo!: string;
    password!: string;

}



export class MedicoResidente extends Medico {
    correo2!: string;
    password2!: string;
matricula!: string;
}