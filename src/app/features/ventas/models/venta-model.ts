import { ProductoVentaModel } from "./producto-venta.model";

export class VentaModel {
  ProductosVenta: ProductoVentaModel[];
  TipoCobro: any;
  SubTotal: number;
  Iva: number;
  Descuento: number;
  Total: number   
}