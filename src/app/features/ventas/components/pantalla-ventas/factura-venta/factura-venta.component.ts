import { Component, inject } from '@angular/core';
import { PrimeNgModule } from '../../../../common/material/primeng.module';
import { CustomMaterialModule } from '../../../../common/material/custom-material.module';
import { GrillaProductosSeleccionadosComponent } from "./grilla-productos-seleccionados/grilla-productos-seleccionados.component";
import { AlertasService } from '../../../../common/services/alertas.service';
import { VentaModel } from '../../../models/venta.model';
import { VentasService } from '../../../services/ventas';

@Component({
  selector: 'app-factura-venta',
  imports: [PrimeNgModule, CustomMaterialModule, GrillaProductosSeleccionadosComponent],
  templateUrl: './factura-venta.component.html',
  styleUrl: './factura-venta.component.scss',
})
export class FacturaVentaComponent {

  private alertasService = inject(AlertasService);
  private ventasService = inject(VentasService);

  finalizarVenta() {
    this.alertasService.confirmacionAlerta(
      'Finalizar venta',
      `Estás a punto de finalizar la venta.
     Una vez confirmada, no podrás modificar los productos ni los importes.
     ¿Deseas continuar?`
    ).then((result) => {
      if (result.isConfirmed) {
        const nuevaVenta: VentaModel = new VentaModel();
        nuevaVenta.Fecha = new Date();

        const ventasItem = this.ventasService.ventasItem();
        ventasItem.forEach(ventaItem => {
          nuevaVenta.ProductosId.push(ventaItem.ProductoId);
          nuevaVenta.Total += ventaItem.Subtotal;
        })

        nuevaVenta.Items = ventasItem;
        nuevaVenta.UsuarioId = '123'

        this.ventasService.crear(nuevaVenta).subscribe({
          next: (response: any) => {
            this.ventasService.ventasItem.set([]);
          },
          error: (err) => {
            console.error(err);
          },
          complete: () => { }
        });
      }
    });
  }

}
