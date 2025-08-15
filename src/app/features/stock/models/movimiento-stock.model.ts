import { CompraModel } from "../../compras/models/compra.model";
import { UsuarioModel } from "../../usuarios/models/usuario.model";
import { VentaModel } from "../../ventas/models/venta.model";
import { ProductoStock } from "./producto-stock.model";

export class MovimientoStockModel {
  Id: string;
  IdFactura: string;
  ProductoStock: ProductoStock;
  Tipo: string; 
  Cantidad: number;
  Fecha: Date;
  Observacion?: string;
  Venta?: VentaModel;
  Compra?: CompraModel;
  AjusteManual?: AjusteStockModel;

}

class AjusteStockModel {
  Id: number;
  Usuario: UsuarioModel;
  Motivo: string;
  Fecha: Date;
}
