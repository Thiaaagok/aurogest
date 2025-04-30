import { MarcaModel } from "../../marcas/models/marca.model";
import { ProveedorModel } from "../../proveedores/models/proveedor.model";
import { ProductoTipoModel } from "./producto-tipo.model";

export class ProductoModel {
    Id: string;
    Descripcion: string;
    Codigo: string;
    Activo: string;
    PrecioVenta: number;
    PrecioCompra: number;
    Tipo: ProductoTipoModel
    Marca: MarcaModel;
    Stock: number;
    Proveedores: ProveedorModel[]
    Imagenes: string[]
    ImagenPresentacion: string;
    Detalles: string;
}