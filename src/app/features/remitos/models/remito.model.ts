// models/remito.model.ts

export type RemitoEstado = 'PENDIENTE' | 'EMITIDO' | 'ANULADO';

export class Remito {
  Id: string;
  Numero: number;
  FechaEmision: Date;
  VentaId: string;
  Total: number;
  Fecha: Date;
  Estado: RemitoEstado;
  Items: RemitoItem[];
  Observaciones?: string;
  ReceptorNombre?: string;
  ReceptorDireccion?: string;
  ReceptorCuit?: string;
}

export class RemitoItem {
  Id: string;
  Descripcion: string;
  Cantidad: number;
  PrecioUnitario: number;
  Subtotal: number;
  ProductoId: string;
}

export class CreateRemitoDto {
  VentaId: string;
  Observaciones?: string;
  ReceptorNombre?: string;
  ReceptorDireccion?: string;
  ReceptorCuit?: string;
}
