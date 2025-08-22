import { ProductoModel } from "../../productos/models/producto.model";
import { ProveedorModel } from "../../proveedores/models/proveedor.model";
import { v4 as uuid } from 'uuid';

export class CompraModel {
  Id: string;
  Fecha: Date;
  Total: number;
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
  Cantidad: number;
  Subtotal: number;

  constructor() {
    this.Id = uuid();
    this.Cantidad = 1;
  }
}