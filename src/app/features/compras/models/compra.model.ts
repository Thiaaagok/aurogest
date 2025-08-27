import { ProductoModel } from "../../productos/models/producto.model";
import { ProveedorModel } from "../../proveedores/models/proveedor.model";
import { v4 as uuid } from 'uuid';
import { UsuarioModel } from "../../usuarios/models/usuario.model";

export class CompraModel {
  Id: string;
  Fecha: Date;
  Total: number;
  Usuario: UsuarioModel;
  UsuarioId: string;
  Items: CompraItemModel[];

  constructor() {
    this.Id = uuid(); 
    this.Items = [];
  }
}

export class CompraItemModel {
  Id: string;
  Proveedor?: ProveedorModel;
  CompraId: string;
  Producto: ProductoModel;
  PrecioUnitarioCompra: number;
  Cantidad: number;
  Subtotal: number;

  constructor() {
    this.Id = uuid();
    this.Cantidad = 1;
  }
}