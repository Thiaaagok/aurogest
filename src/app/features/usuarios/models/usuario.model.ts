import { EmpresaModel } from "../../empresas/models/empresa.model";

export class UsuarioModel {
    Id: string;
    Usuario: string;
    Contrasenia: string;
    Legajo: string;
    Mail: string;
    Empresa: EmpresaModel;
    IntentosConexion: number;
    ExpiracionTiempo: number;
    Bloqueado: boolean;
    UltimaConexion: Date;
    Observaciones: string;
    Activo: boolean;
}