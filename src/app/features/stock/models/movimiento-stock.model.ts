import { ProductoModel, ProductoStock } from "../../productos/models/producto.model";
import { ProveedorModel } from "../../proveedores/models/proveedor.model";
import { Usuario } from "../../usuarios/models/usuario.model";

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

export class Venta {
  Id: string;
  Fecha: Date;
  Total: number;
  Items: VentaItem[]; 
}

export class VentaItem {
  Id: string;
  Venta: Venta;
  Producto: ProductoModel;
  Cantidad: number;
  PrecioUnitario: number;
  Subtotal: number;
}

class AjusteStock {
  Id: number;
  Usuario: Usuario;
  Motivo: string;
  Fecha: Date;
}

export class Compra {
  Id: string;
  Proveedor?: ProveedorModel;
  Fecha: Date;
  Total: number;
  Items: CompraItem[];
}

export class CompraItem {
  Id: string;
  Compra: Compra;
  Producto: ProductoModel;
  Cantidad: number;
  PrecioUnitario: number;
  Subtotal: number;
}
