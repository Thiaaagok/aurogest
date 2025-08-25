import { ProductoModel } from "../../productos/models/producto.model";


export class ProductoStock {
    Id: string;
    Producto: ProductoModel;
    StockActualTotal: number;
    StockActual: ProductoStockLote[];
    StockMinimo: number;
    UltimaActualizacion?: Date;
    Activo?: boolean;
    Observaciones?: string;
    StockReservado?: number;
}

export class ProductoStockLote {
    Id: string;
    FechaCompra: Date;
    PrecioCompra: number;
    CantidadActual: number;
    Estado: ProductoStockLoteEstado;
    CantidadInicial: number;
}

export class ProductoStockLoteEstado {
    Id: string;
    Descripcion: string;
    Codigo: string;
    Activo: boolean;
}