import { ClaseBase } from "../../common/models/clase-base.model";
import { EmpresaModel } from "../../empresas/models/empresa.model";
import { ProveedorModel } from "../../proveedores/models/proveedor.model";
import { MarcaModel } from "./marca.model";
import { ProductoCategoriaModel } from "./producto-categoria.model";
import { ProductoTipoModel } from "./producto-tipo.model";

export class ProductoModel {
    Id: string;
    Codigo: string;
    CodigoBarra: string;
    Nombre: string;
    Tipo?: ProductoTipoModel;
    Categoria?: ProductoCategoriaModel;
    Marca?: MarcaModel;
    Proveedores?: ProveedorModel[];
    PrecioCompra: number;
    PrecioVenta: number;
    FechaCreacion: Date;
    FechaActualizacion: Date;
    PermitirVenta: boolean;
    Empresa: EmpresaModel;
    Activo: boolean;

    constructor(){
        this.Proveedores = [];
    }
} 


export class ProductoDetalleModel {
    Titulo: string;
    Descripcion: string;
}

export class ProductoStock{
    Id: string;
    Producto: ProductoModel;
    Deposito: DepositoModel;
    StockActual: number;
    StockMinimo: number;
    StockMaximo?: number;
    UnidadMedida?: string;
    UltimaActualizacion?: Date;
    Activo?: boolean;
    Observaciones?: string;
    StockReservado?: number;
}

export class DepositoModel extends ClaseBase {

}