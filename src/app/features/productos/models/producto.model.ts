import { ProveedorModel } from "../../proveedores/models/proveedor.model";
import { ProductoStock } from "../../stock/models/producto-stock.model";
import { MarcaModel } from "./marca.model";
import { ProductoCategoriaModel } from "./producto-categoria.model";
import { ProductoTipoModel } from "./producto-tipo.model";

export class ProductoModel {
    Id: string;
    CodigoBarra: string;
    Codigo: string;
    Descripcion: string;
    Imagen: File;
    Tipo?: ProductoTipoModel;
    Categoria?: ProductoCategoriaModel;
    Marca?: MarcaModel;
    Proveedores: ProveedorModel[];
    PrecioCompra: number;
    PrecioVenta: number;
    FechaCreacion: Date;
    FechaActualizacion: Date;
    PermitirVenta: boolean;
    Stock: ProductoStock;
    Imagenes: string[];
    Activo: boolean;

    constructor(){
        this.Proveedores = [];
    }
} 

export class ProductoDetalleModel {
    Titulo: string;
    Descripcion: string;
}