import { ProductoStock } from "../../stock/models/producto-stock.model";

export class Venta {
    Id: string;
    Fecha: Date;
    Total: number;
    Items: VentaItem[];
}

export class VentaItem {
    Id: string;
    Venta: Venta;
    ProductoStock: ProductoStock;
    Cantidad: number;
    PrecioUnitario: number;
    Subtotal: number;
}