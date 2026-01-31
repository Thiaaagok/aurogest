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
        this.Imagenes = [];
    }
} 

export class ProductoDetalleModel {
    Titulo: string;
    Descripcion: string;
}

const otrosVarios: ProductoModel = {
    Id: 'e01572c6-d6e8-4652-bc6a-ed791bddd841',
    CodigoBarra: '',
    Codigo: 'VARIOS',
    Descripcion: 'Otros Varios',
    Imagen: null as any, 
    Proveedores: [],
    PrecioCompra: 0,
    PrecioVenta: 0,
    FechaCreacion: new Date(2026, 0, 1),
    FechaActualizacion: new Date(2026, 0, 1),
    PermitirVenta: true,
    Activo: true,
    Imagenes: [],
    Stock: {
        Id: 'stock-varios',
        Producto: null as any, // se puede setear luego
        StockActualTotal: 0,
        StockMinimo: 0,
        Lotes: [],
        Activo: true
    }
};