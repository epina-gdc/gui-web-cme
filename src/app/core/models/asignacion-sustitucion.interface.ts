export interface BusquedaPermisoEspecifico {
    cveOoad: string;
    desOoad: string;
    cveZona: string;
    desZona: string;
    cveEspecialidad: string;
    desEspecialidad: string;
    idConvocatoria: number;
}

export interface BusquedaPermisoEspecificoResult {
    idPermisoSustitucion: number;
    desZona: string;
    cveZona: string;
    cveOoad: string;
    desOoad: string;
    cveEspecialidad: string;
    desEspecialidad: string;
    indPermisoSustitucion: number;
    idConvocatoria: number;
}
