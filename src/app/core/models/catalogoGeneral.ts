import { ResponseGeneral } from "./responseGeneral";


export class CatalogoGeneral  {
    id!: number;
    descripcion!: string;
    
}

export class Pais{
  idPais!: number;
  cvePais!: string;
  desPais!: string;
  indActivo!: number;
}
export class CatPerfil{
    idPerfil!: number;
    nomPerfil!: string;
    indActivo!: number;
}


export class CatSubperfil{
  idSubperfil!: number;
  nomSubperfil!: string;
  idPerfil!: number;
  indActivo!: number;
}

export class CatPerfilResponse extends ResponseGeneral{
  respuesta!: Array<CatPerfil>;
}

export class CatSubperfilResponse extends ResponseGeneral{
  respuesta!: Array<CatSubperfil>;
}

export class CatPaisResponse extends ResponseGeneral{
  respuesta!: Array<Pais>;
}