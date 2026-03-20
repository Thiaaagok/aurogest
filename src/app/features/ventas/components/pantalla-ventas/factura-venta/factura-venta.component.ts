import { Component, inject } from '@angular/core';
import { PrimeNgModule } from '../../../../common/material/primeng.module';
import { CustomMaterialModule } from '../../../../common/material/custom-material.module';
import { GrillaProductosSeleccionadosComponent } from './grilla-productos-seleccionados/grilla-productos-seleccionados.component';
import { AlertasService } from '../../../../common/services/alertas.service';
import { VentaModel } from '../../../models/venta.model';
import { VentasService } from '../../../services/ventas';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmarVentaDialogComponent } from './confirmar-venta-dialog/confirmar-venta-dialog.component';
import { RemitosService } from '../../../../remitos/services/remitos.service';
import { CreateRemitoDto } from '../../../../remitos/models/remito.model';
import {
  DatosRemitoDialogComponent,
  DatosRemitoEmision,
} from './datos-remito-dialog/datos-remito-dialog.component';

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
  private remitoService = inject(RemitosService);

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
          next: (venta) => {
            this.ventasService.ventasItem.set([]);

            switch (emision) {
              case 'remito':
                this.abrirDialogDatosRemito(venta.Id);
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

  private abrirDialogDatosRemito(ventaId: string) {
    const dialog = this.dialogService.open(DatosRemitoDialogComponent, {
      width: '480px',
      height: 'fit-content',
      modal: true,
      header: undefined,
      styleClass: 'backdrop-blur-sm !border-0 bg-transparent cvd-dialog',
    });

    dialog.onClose.subscribe((datos: DatosRemitoEmision | null) => {
      if (datos === null) return;
      const dto = new CreateRemitoDto();
      dto.VentaId = ventaId;
      dto.Observaciones = datos.observaciones;
      dto.ReceptorNombre = datos.receptorNombre;
      dto.ReceptorDireccion = datos.receptorDireccion;
      dto.ReceptorCuit = datos.receptorCuit;

      this.remitoService.crear(dto).subscribe({
        next: (remito) => {
          this.remitoService.imprimirRemito(remito.Id);
        },
        error: (err) => console.error(err),
      });
    });
  }
}
