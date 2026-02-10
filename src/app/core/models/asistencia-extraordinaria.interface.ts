export interface AsistenciaExtraordinariaResponse {
    exito: boolean;
    mensaje: string;
    respuesta: AsistenciaAspirante | null;
}

export interface AsistenciaAspirante {
    idParticipante: number;
    nomParticipante: string;
    uuidArchivo: string | null;
    matricula: string | null;
    curp: string | null;
    rfc: string | null;
    fechaCita: string;
    horaCita: string;
    mesaCita: string;
    turnoCita: string;
    diaAsistenciaCita: string;
    horaAsistencia: string;
    turnoAsistencia: string;
    modalidad: string;
    estatus: string;
    verificacionDoc: string;
    especialidades: string[];
    indCitaExtraordinaria: boolean;
}
export interface Medico {
    nombre: string;
    matricula: string;
    curp: string;
    rfc: string;
    especialidades: string[];
    fotoUrl: string;
    // Datos de la cita/asistencia
    fecha: string;
    hora: string;
    mesa: string;
    turno: string;
    modalidad: string;
    estatus: string;
    verificacion: string;
}