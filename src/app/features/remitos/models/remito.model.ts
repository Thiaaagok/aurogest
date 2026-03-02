// models/remito.model.ts

export type RemitoEstado = 'PENDIENTE' | 'EMITIDO' | 'ANULADO';

export interface RemitoVentaItem {
  descripcion: string;
  cantidad: number;
  subtotal: number;
}

export interface RemitoVenta {
  id: string;
  fecha: Date;
  total: number;
  items: RemitoVentaItem[];
}

export interface Remito {
  id: string;
  numero: number;
  fechaEmision: Date;
  estado: RemitoEstado;
  observaciones?: string;
  receptorNombre?: string;
  receptorDireccion?: string;
  receptorCuit?: string;
  venta: RemitoVenta;
}

export interface CreateRemitoDto {
  ventaId: string;
  observaciones?: string;
  receptorNombre?: string;
  receptorDireccion?: string;
  receptorCuit?: string;
}
