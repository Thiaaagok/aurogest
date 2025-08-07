import { ProductoModel } from "../../productos/models/producto.model";


export class ProductoStock{
    Id: string;
    Producto: ProductoModel;
    StockActual: number;
    StockMinimo: number;
    UltimaActualizacion?: Date;
    Activo?: boolean;
    Observaciones?: string;
    StockReservado?: number;
}
