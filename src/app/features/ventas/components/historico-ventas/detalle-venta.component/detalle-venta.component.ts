import { Component, inject } from '@angular/core';
import { VentaModel } from '../../../models/venta.model';
import { UsuarioModel } from '../../../../usuarios/models/usuario.model';
import { ProductoModel } from '../../../../productos/models/producto.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CustomMaterialModule } from '../../../../common/material/custom-material.module';
import { PrimeNgModule } from '../../../../common/material/primeng.module';

@Component({
  selector: 'app-detalle-venta.component',
  imports: [CustomMaterialModule, PrimeNgModule],
  templateUrl: './detalle-venta.component.html',
  styleUrl: './detalle-venta.component.scss',
})
export class DetalleVentaComponent {
  venta: VentaModel;
  usuariosCombo: UsuarioModel[] = [];
  productosCombo: ProductoModel[] = [];

  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  constructor() {
    this.venta = this.config.data.venta;
    this.usuariosCombo = this.config.data.usuarios;
    this.productosCombo = this.config.data.productos;
  }

  get usuario(): string {
    return (
      this.usuariosCombo.find((u) => u.Id === this.venta.UsuarioId)?.Usuario ||
      '—'
    );
  }

  get totalCosto(): number {
    return this.venta.Items.reduce(
      (acc, item) =>
        acc + item.LotesVendidos.reduce((a, l) => a + +l.Subtotal, 0),
      0,
    );
  }

  get margen(): number {
    if (!this.totalCosto) return 0;
    return +(
      ((this.venta.Total - this.totalCosto) / this.totalCosto) *
      100
    ).toFixed(1);
  }

  obtenerNombreProducto(productoId: string): string {
    return (
      this.productosCombo.find((p) => p.Id === productoId)?.Descripcion || '—'
    );
  }

  cerrar(): void {
    this.ref.close();
  }
}
