import { v4 as uuid } from 'uuid';
import { ProductoModel } from '../../productos/models/producto.model';
import { ProveedorModel } from '../../proveedores/models/proveedor.model';

export class CompraModel {
  Id: string;
  Fecha: Date;
  Total: number;
  UsuarioId: string;
  Items: CompraItem[];
  ProductosId: string[];

  constructor() {
    this.Id = uuid(); 
    this.Items = [];
    this.ProductosId = [];
  }
}

export class CompraItem {
  Id: string;
  ProveedorId?: string;
  CompraId: string;
  ProductoId: string;
  PrecioUnitarioCompra: number;
  Cantidad: number;
  Subtotal: number;
  Frontend: CompraItemFrontend;

  constructor() {
    this.Id = uuid();
    this.Cantidad = 1;
    this.Frontend = new CompraItemFrontend();
  }
} 

export class CompraItemFrontend {
  Producto: ProductoModel;
  Proveedor: ProveedorModel;

  constructor(){
    this.Producto = new ProductoModel();
    this.Proveedor = new ProveedorModel();
  }
}