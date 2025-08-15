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
    Cantidad: number;
    PrecioUnitario: number;
    Subtotal: number;
}