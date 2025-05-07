import { EmpresaModel } from "../../empresas/models/empresa.model";

export class MarcaModel {
    Id: string;
    Descripcion: string;
    Codigo: string;
    Empresa: EmpresaModel
    Activo: boolean;
}