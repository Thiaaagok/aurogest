export class ProductoAnalizado {
  ProductoId: string;
  NombreProducto?: string;
  CostoTotal: number;
  TotalVendido: number;
  TotalInvertido: number;
  RendimientoTotal: number;
  IndiceRecuperacion: number;
  ResultadoNeto: number;
}

export class RendimientoAnalizado {
  Id: string;
  FechaDesde: Date;
  FechaHasta: Date;
  ProductosAnalizados: ProductoAnalizado[] = [];
}

export class AnalizarRendimientoDto {
  FechaDesde: string;
  FechaHasta: string;
  ProductosId: string[] = [];
}
