import { Component, effect, inject } from '@angular/core';
import { PrimeNgModule } from '../../../../../common/material/primeng.module';
import { VentaItem } from '../../../../models/venta.model';
import { VentasService } from '../../../../services/ventas';
import { AlertasService } from '../../../../../common/services/alertas.service';

@Component({
  selector: 'app-grilla-productos-seleccionados',
  imports: [PrimeNgModule],
  templateUrl: './grilla-productos-seleccionados.component.html',
  styleUrl: './grilla-productos-seleccionados.component.scss',
})
export class GrillaProductosSeleccionadosComponent {
  private ventasService = inject(VentasService);
  private alertasService = inject(AlertasService);

  ventas: VentaItem[] = [];

  constructor() {
    effect(() => {
      this.ventas = this.ventasService.ventasItem();
    });
  }

  disminuirCantidad(event: MouseEvent, ventaItem: VentaItem) {
    event.stopPropagation();
    if (ventaItem.Cantidad > 1) {
      ventaItem.Cantidad--;
      ventaItem.Subtotal = +(
        ventaItem.PrecioUnitarioVenta * ventaItem.Cantidad
      ).toFixed(2);

      this.ventasService.ventasItem.set([...this.ventas]);
    }
  }

  aumentarCantidad(event: MouseEvent, ventaItem: VentaItem) {
    event.stopPropagation();
    ventaItem.Cantidad++;
    ventaItem.Subtotal = +(
      ventaItem.PrecioUnitarioVenta * ventaItem.Cantidad
    ).toFixed(2);

    this.ventasService.ventasItem.set([...this.ventas]);
  }

  eliminarItem(ventaItem: VentaItem) {
    this.alertasService
      .confirmacionAlerta(
        'Confirmar eliminación',
        `Vas a eliminar el ítem "${ventaItem.Descripcion ?? 'sin descripción'}" de la compra. 
        Esta acción no se puede deshacer. ¿Deseas continuar?`,
      )
      .then((result) => {
        if (!result.isConfirmed) return;

        const index = this.ventas.indexOf(ventaItem);
        if (index >= 0) {
          this.ventas.splice(index, 1);
          this.ventasService.ventasItem.set([...this.ventas]);
        }
      });
  }
}
