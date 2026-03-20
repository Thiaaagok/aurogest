import { Component, inject } from '@angular/core';
import { CompraModel } from '../../../models/compra.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductosService } from '../../../../productos/services/producto.service';
import { ProveedoresService } from '../../../../proveedores/services/proveedores.service';
import { ProductoModel } from '../../../../productos/models/producto.model';
import { ProveedorModel } from '../../../../proveedores/models/proveedor.model';
import { PrimeNgModule } from '../../../../common/material/primeng.module';
import { CustomMaterialModule } from '../../../../common/material/custom-material.module';

@Component({
  selector: 'app-detalle-compra.component',
  imports: [PrimeNgModule, CustomMaterialModule],
  templateUrl: './detalle-compra.component.html',
  styleUrl: './detalle-compra.component.scss',
})
export class DetalleCompraComponent {
  compra: CompraModel;

  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private productosService = inject(ProductosService);
  private proveedoresService = inject(ProveedoresService);

  productosCombo: ProductoModel[] = [];
  proveedoresCombo: ProveedorModel[] = [];

  constructor() {
    this.compra = this.config.data;
  }

  ngOnInit() {
    this.cargarProductos();
    this.cargarProveedores();
  }

  cargarProductos() {
    this.productosService.obtenerTodos().subscribe({
      next: (res: ProductoModel[]) => (this.productosCombo = res),
    });
  }

  cargarProveedores() {
    this.proveedoresService.obtenerTodos().subscribe({
      next: (res: ProveedorModel[]) => (this.proveedoresCombo = res),
    });
  }

  obtenerNombreProducto(productoId: string): string {
    return (
      this.productosCombo.find((p) => p.Id === productoId)?.Descripcion || '—'
    );
  }

  obtenerNombreProveedor(proveedorId: string | null | undefined): string {
    if (!proveedorId) return '—';
    return (
      this.proveedoresCombo.find((p) => p.Id === proveedorId)?.Descripcion ||
      '—'
    );
  }

  cerrar() {
    this.ref.close();
  }
}
