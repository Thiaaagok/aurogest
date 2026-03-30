export type TipoPrecio = 'VENTA' | 'COMPRA' | 'AMBOS';

export const TIPOS_PRECIO = [
  { label: 'Precio de venta',  value: 'VENTA'  },
  { label: 'Precio de compra', value: 'COMPRA' },
  { label: 'Ambos precios',    value: 'AMBOS'  },
];

export class ProductoSimpleModel {
  Id: string;
  Descripcion: string;
  PrecioVenta: number;
  PrecioCompra: number;
}

export class ProductoPrecioPreview {
  Id: string;
  Descripcion: string;
  PrecioVentaActual: number;
  PrecioVentaNuevo: number | null;
  PrecioCompraActual: number;
  PrecioCompraNuevo: number | null;
  Diferencia: number;
  DiferenciaPorcentaje: number;
  // selección local — no viene del backend
  seleccionado?: boolean;
}

export class AjustePrecioRequestDto {
  ProductoIds: string[];
  Porcentaje: number;
  TipoPrecio: TipoPrecio;
}
