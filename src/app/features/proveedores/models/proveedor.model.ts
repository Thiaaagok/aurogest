import { EmpresaModel } from "../../empresas/models/empresa.model";

export class ProveedorModel {
    Id: string;
    Descripcion: string;
    Codigo: string;
    Cuit: string;
    Telefono: string;
    Email: string;
    Web: string;
    Observaciones: string;
    Direccion: string;
    CodigoPostal: string;
    Empresa: EmpresaModel;
    Activo: boolean;
}