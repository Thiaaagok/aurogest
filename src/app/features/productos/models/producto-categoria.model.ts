import { EmpresaModel } from "../../empresas/models/empresa.model";

export class ProductoCategoriaModel {
    Id: string;
    Codigo: string;
    Descripcion: string;
    Empresa: EmpresaModel;
    Activo: boolean;
}