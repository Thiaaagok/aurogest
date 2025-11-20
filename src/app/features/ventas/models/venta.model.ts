import { ProductoStock } from "../../stock/models/producto-stock.model";
import { UsuarioModel } from "../../usuarios/models/usuario.model";
import { v4 as uuid } from 'uuid';

export class VentaModel {
    Id: string;
    Fecha: Date;
    Total: number;
    Items: VentaItem[];
    UsuarioId: string;
    ProductosId: string[];
    
    constructor(){
        this.Items = [];
        this.ProductosId = [];
        this.Total = 0;
    }
}

export class VentaItem {
    Id: string;
    ProductoId: string;
    Descripcion: string;
    Cantidad: number;
    LotesVendidos: ProductoStockLoteVendido[];
    PrecioUnitarioVenta: number;
    Subtotal: number;

    constructor(){
        this.Id = uuid();
    }
}

export class ProductoStockLoteVendido {
    Id: string;
    ProductoStockLoteId: string;
    CantidadVendida: number;
    CantidadRestante: number;
    PrecioUnitarioCompra: number;
    Subtotal: number;
}