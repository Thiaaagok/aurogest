import { Compra } from "../../compras/models/compra.model";
import { ProductoModel } from "../../productos/models/producto.model";
import { ProveedorModel } from "../../proveedores/models/proveedor.model";
import { Usuario } from "../../usuarios/models/usuario.model";
import { Venta } from "../../ventas/models/venta.model";
import { ProductoStock } from "./producto-stock.model";

export class MovimientoStock {
  Id: string;
  IdFactura: string;
  ProductoStock: ProductoStock;
  Tipo: string; 
  Cantidad: number;
  Fecha: Date;
  Observacion?: string;
  Venta?: Venta;
  Compra?: Compra;
  AjusteManual?: AjusteStock;

}

class AjusteStock {
  Id: number;
  Usuario: Usuario;
  Motivo: string;
  Fecha: Date;
}
