import { ProductoModel } from "../../productos/models/producto.model";
import { ProveedorModel } from "../../proveedores/models/proveedor.model";
import { v4 as uuid } from 'uuid';

export class CompraModel {
  Id: string;
  Fecha: Date;
  Total: number;
  Items: CompraItemModel[];

  constructor() {
    this.Items = [];
  }
}

export class CompraItemModel {
  Id: string;
  Proveedor?: ProveedorModel;
  Compra: CompraItemModel;
  Producto: ProductoModel;
  Cantidad: number;
  PrecioUnitario: number;
  Subtotal: number;

  constructor(){
    this.Id = uuid();
  }
}