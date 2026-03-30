export interface ProductoInflacionMes {
  ProductoId: string;
  Nombre: string;
  InflacionCompra: number;
  InflacionVenta: number;
  CantidadActualizaciones: number;
}

export interface AnalisisMesActual {
  FechaDesde: Date;
  FechaHasta: Date;
  InflacionCompra: number;
  InflacionVenta: number;
  CantidadActualizaciones: number;
  Productos: ProductoInflacionMes[];
}