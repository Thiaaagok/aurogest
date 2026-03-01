import { PermisoKey } from "../../common/enums/roles.enum";

export class RolUsuarioModel {
    Id: string;
    Descripcion: string;
    Codigo: string;
    Activo: boolean;
    Permisos: PermisoKey[];
}