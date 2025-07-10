import { EmpresaModel } from "../../empresas/models/empresa.model";
import { MarcaModel } from "../../marcas/models/marca.model";
import { ProveedorModel } from "../../proveedores/models/proveedor.model";
import { ProductoCategoriaModel } from "./producto-categoria.model";
import { ProductoTipoModel } from "./producto-tipo.model";

export class ProductoModel {
    Id: string;
    Codigo: string;
    CodigoBarra: string;
    Nombre: string;
    Detalles: ProductoDetalleModel[];
    Tipo?: ProductoTipoModel;
    Categoria?: ProductoCategoriaModel;
    Marca?: MarcaModel;
    Proveedores?: ProveedorModel[];
    PrecioCompra: number;
    PrecioVenta: number;
    Stock: number;
    FechaCreacion: Date;
    FechaActualizacion: Date;
    PermitirVenta: boolean;
    Empresa: EmpresaModel;
    Activo: boolean;

    constructor(){
        this.Detalles = [];
        this.Proveedores = [];
    }
} 


export class ProductoDetalleModel {
    Titulo: string;
    Descripcion: string;
}