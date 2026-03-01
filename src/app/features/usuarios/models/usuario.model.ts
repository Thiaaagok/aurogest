import { EmpresaModel } from "../../empresas/models/empresa.model";
import { RolUsuarioModel } from "../../roles-usuario/models/rol-usuario.model";

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
    Rol: RolUsuarioModel;
    RolId: string;
    Activo: boolean;
}