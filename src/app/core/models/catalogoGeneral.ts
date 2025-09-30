import { ResponseGeneral } from "./responseGeneral";

export class CatalogoGeneral  {
    id!: number;
    descripcion!: string;
    
}


export class CatPerfil{
    idPerfil!: number;
    nomPerfil!: string;
    indActivo!: number;
}

export class CatPerfilResponse extends ResponseGeneral{
  respuesta!: Array<CatPerfil>;
}