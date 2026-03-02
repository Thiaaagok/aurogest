import { Component, inject } from '@angular/core';
import { PrimeNgModule } from '../../../../common/material/primeng.module';
import { CustomMaterialModule } from '../../../../common/material/custom-material.module';
import { GrillaProductosSeleccionadosComponent } from './grilla-productos-seleccionados/grilla-productos-seleccionados.component';
import { AlertasService } from '../../../../common/services/alertas.service';
import { VentaModel } from '../../../models/venta.model';
import { VentasService } from '../../../services/ventas';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmarVentaDialogComponent } from './confirmar-venta-dialog/confirmar-venta-dialog.component';

@Component({
  selector: 'app-factura-venta',
  imports: [
    PrimeNgModule,
    CustomMaterialModule,
    GrillaProductosSeleccionadosComponent,
  ],
  templateUrl: './factura-venta.component.html',
  styleUrl: './factura-venta.component.scss',
})
export class FacturaVentaComponent {

  private ventasService = inject(VentasService);
  private dialogService = inject(DialogService);

  finalizarVenta() {
    const dialog = this.dialogService.open(ConfirmarVentaDialogComponent, {
      width: '480px',
      height: 'fit-content',
      modal: true,
      header: undefined,
      styleClass: 'backdrop-blur-sm !border-0 bg-transparent cvd-dialog',
    });

    dialog.onClose.subscribe(
      (emision: 'ninguno' | 'remito' | 'factura' | null) => {
        if (!emision) return; // canceló

        const nuevaVenta: VentaModel = new VentaModel();
        nuevaVenta.Fecha = new Date();

        const ventasItem = this.ventasService.ventasItem();
        ventasItem.forEach((ventaItem) => {
          nuevaVenta.ProductosId.push(ventaItem.ProductoId);
          nuevaVenta.Total += ventaItem.Subtotal;
        });

        nuevaVenta.Items = ventasItem;
        nuevaVenta.UsuarioId = '123';

        this.ventasService.crear(nuevaVenta).subscribe({
          next: () => {
            this.ventasService.ventasItem.set([]);

            // Acá manejás cada caso según lo que eligió
            switch (emision) {
              case 'remito':
                // this.remitoService.generar(nuevaVenta);
                break;
              case 'factura':
                // this.afipService.emitir(nuevaVenta);
                break;
              case 'ninguno':
              default:
                break;
            }
          },
          error: (err) => {
            console.error(err);
          },
        });
      },
    );
  }
}
