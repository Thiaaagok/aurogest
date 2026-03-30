import { Pipe, PipeTransform } from '@angular/core';

/**
 * Suma una propiedad numérica de un array de objetos.
 * Uso: {{ items | sumBy: 'PrecioVentaActual' }}
 */
@Pipe({ name: 'sumBy', standalone: true })
export class SumByPipe implements PipeTransform {
  transform(items: any[], campo: string): number {
    if (!items?.length) return 0;
    return items.reduce((acc, item) => {
      const val = parseFloat(item[campo]);
      return acc + (isNaN(val) ? 0 : val);
    }, 0);
  }
}
