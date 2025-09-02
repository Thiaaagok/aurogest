import { ProductoStock } from "../../stock/models/producto-stock.model";

export class VentaModel {
    Id: string;
    Fecha: Date;
    Total: number;
    Items: VentaItem[];
}

export class VentaItem {
    Id: string;
    Venta: VentaModel;
    ProductoStock: ProductoStock;
    Descripcion: string;
    Cantidad: number;
    LotesVendidos: ProductoStockLoteVendido[];
    PrecioUnitarioVenta: number;
    Subtotal: number;
}

export class ProductoStockLoteVendido {
    Id: string;
    VentaItem: VentaItem;
    ProductoStockLoteId: string;
    CantidadVendida: number;
    CantidadRestante: number;
    PrecioUnitarioCompra: number;
    Subtotal: number;
}