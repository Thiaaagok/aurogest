import { ProductoStock, ProductoStockLote } from "../../stock/models/producto-stock.model";

export class VentaModel {
    Id: string;
    Fecha: Date;
    Total: number;
    Items: VentaItem[];
    ProductosVendidosIds: string[];
}

export class VentaItem {
    Id: string;
    Venta: VentaModel;
    ProductoStock: ProductoStock;
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