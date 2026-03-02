import { Pipe, PipeTransform } from '@angular/core';
import { VentaItem } from '../../ventas/models/venta.model';

@Pipe({
  name: 'totalVenta',
  standalone: true,
})
export class TotalVentaPipe implements PipeTransform {
  transform(items: VentaItem[]): string {
    if (!items?.length) return '0.00';
    const total = items.reduce((acc, item) => acc + (item.Subtotal ?? 0), 0);
    return total.toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}
