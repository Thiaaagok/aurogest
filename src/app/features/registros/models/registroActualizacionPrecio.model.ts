import { ProductoModel } from "../../productos/models/producto.model";
import { UsuarioModel } from "../../usuarios/models/usuario.model";

export enum TipoPrecio {
  COMPRA = 'COMPRA',
  VENTA = 'VENTA',
}

export class RegistroActualizacionPrecio {
  Id: string;
  Producto: ProductoModel;
  Tipo: TipoPrecio;
  PrecioAnterior: number = 0;
  PrecioNuevo: number = 0;
  Porcentaje: number = 0;
  FechaActualizacion: Date = new Date();
  Usuario?: UsuarioModel;
}