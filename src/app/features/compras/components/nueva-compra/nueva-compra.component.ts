import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';

import { CompraModel, CompraItem } from '../../models/compra.model';
import { ProductoModel } from '../../../productos/models/producto.model';
import { ProveedorModel } from '../../../proveedores/models/proveedor.model';

import { ComprasService } from '../../services/compras.service';
import { ProductosService } from '../../../productos/services/producto.service';
import { AlertasService } from '../../../common/services/alertas.service';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { QrScannerService } from '../../../common/services/qrScanner.service';

@Component({
  selector: 'app-nueva-compra',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimeNgModule, ToastModule],
  templateUrl: './nueva-compra.component.html',
  styleUrl: './nueva-compra.component.scss',
})
export class NuevaCompraComponent implements OnInit, OnDestroy {

  nuevaCompra: CompraModel = new CompraModel();
  nuevoItem: CompraItem = new CompraItem();
  productoSeleccionado: string;

  productosCombo: ProductoModel[] = [];
  proveedoresCombo: ProveedorModel[] = [];

  codigoBarra: string;
  cargando: boolean = false;

  private qrSubscription!: Subscription;

  private comprasService   = inject(ComprasService);
  private productosService = inject(ProductosService);
  private qrService        = inject(QrScannerService);
  private alertasService   = inject(AlertasService);
  private messageService   = inject(MessageService);
  private dialogService    = inject(DialogService);
  private router           = inject(Router);

  // ── Lifecycle ───────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.cargarProductosCombo();
    this.qrSubscription = this.qrService.qrScanned.subscribe((qr: string) => {
      this.codigoBarra = qr;
      this.obtenerProductoEscaneado();
    });
  }

  ngOnDestroy(): void {
    this.qrSubscription?.unsubscribe();
  }

  // ── Getter: total de la compra ──────────────────────────────────────────

  get totalCompra(): number {
    return +this.nuevaCompra.Items
      .reduce((acc, item) => acc + (item.Subtotal ?? 0), 0)
      .toFixed(2);
  }

  // ── QR ─────────────────────────────────────────────────────────────────

  obtenerProductoEscaneado(): void {
    this.productosService
      .obtenerProductoPorCodigoBarra(this.codigoBarra)
      .subscribe({
        next: (response: ProductoModel) => {
          this.messageService.add({
            severity: 'success',
            summary: 'QR escaneado',
            detail: 'Producto encontrado correctamente',
          });
          this.productoSeleccionado = response.Id;
          this.productoSeleccionadoEvent(response.Id);
        },
        error: (err) => console.error(err),
      });
  }

  // ── Selección de producto ───────────────────────────────────────────────

  productoSeleccionadoEvent(productoId: string): void {
    this.productoSeleccionado = productoId;
    this.nuevoItem.ProveedorId = undefined;
    this.nuevoItem.Subtotal = 0;

    const producto = this.productosCombo.find((p) => p.Id === productoId);
    if (producto) {
      this.nuevoItem.Frontend.Producto = producto;
      this.nuevoItem.ProductoId        = productoId;
      this.nuevoItem.PrecioUnitario    = producto.PrecioCompra;
      this.proveedoresCombo            = producto.Proveedores;
      this.nuevoItem.Subtotal          = +(producto.PrecioCompra * this.nuevoItem.Cantidad).toFixed(2);
    }
  }

  limpiarProductoSeleccionado(): void {
    this.productoSeleccionado = '';
    this.nuevoItem            = new CompraItem();
    this.proveedoresCombo     = [];
  }

  // ── Agregar ítem ────────────────────────────────────────────────────────

  crearNuevoItem(): void {
    if (this.verificarItem()) {
      this.nuevaCompra.Items.push({ ...this.nuevoItem });
      this.limpiarProductoSeleccionado();
    } else {
      this.alertasService.advertenciaAlerta(
        'No se pudo agregar el ítem',
        'Este producto y proveedor ya están registrados en la compra.',
      );
    }
  }

  private verificarItem(): boolean {
    return !this.nuevaCompra.Items.some(
      (item) =>
        item.ProductoId === this.nuevoItem.Frontend.Producto?.Id &&
        item.ProveedorId === this.nuevoItem.ProveedorId,
    );
  }

  // ── Cantidad ────────────────────────────────────────────────────────────

  cantidadCambio(cantidadNueva: number): void {
    if (!this.nuevoItem.Frontend?.Producto) return;
    this.nuevoItem.Subtotal = +(this.nuevoItem.PrecioUnitario * cantidadNueva).toFixed(2);
  }

  disminuirCantidad(event: MouseEvent, item: CompraItem): void {
    event.stopPropagation();
    if (item.Cantidad <= 1) return;
    item.Cantidad--;
    this.recalcularSubtotal(item);
  }

  aumentarCantidad(event: MouseEvent, item: CompraItem): void {
    event.stopPropagation();
    item.Cantidad++;
    this.recalcularSubtotal(item);
  }

  cambiarCantidad(valor: number, item: CompraItem): void {
    if (!valor || valor < 1) item.Cantidad = 1;
    this.recalcularSubtotal(item);
  }

  private recalcularSubtotal(item: CompraItem): void {
    item.Subtotal = +(item.PrecioUnitario * item.Cantidad).toFixed(2);
  }

  // ── Editar precio ───────────────────────────────────────────────────────

  editarPrecioCompra(item: CompraItem): void {
    /* const dialog = this.dialogService.open(EditarPrecioComponent, {
      header: 'Editar precio de compra',
      width: '400px',
      data: { Producto: item.Frontend.Producto, Tipo: 'COMPRA' },
      modal: true,
      styleClass: 'backdrop-blur-sm !border-0 bg-transparent',
    });

    dialog.onClose.subscribe((response: any) => {
      if (response?.resultado) {
        item.PrecioUnitario = parseFloat(Number(response.nuevoPrecio).toFixed(2));
        // PrecioUnitarioCompra es el que se usa para calcular en la tabla
        (item as any).PrecioUnitarioCompra = item.PrecioUnitario;
        item.Subtotal = parseFloat((item.PrecioUnitario * item.Cantidad).toFixed(2));
      }
    }); */
  }

  // ── Eliminar ítem ───────────────────────────────────────────────────────

  eliminarItem(compraItem: CompraItem): void {
    this.alertasService
      .confirmacionAlerta(
        'Eliminar ítem',
        `¿Eliminar "${compraItem.Frontend.Producto?.Descripcion ?? 'este ítem'}" de la compra?`,
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.nuevaCompra.Items = this.nuevaCompra.Items.filter(
            (item) => item.Id !== compraItem.Id,
          );
        }
      });
  }

  // ── Guardar compra ──────────────────────────────────────────────────────

  onSubmit(): void {
    if (!this.nuevaCompra.Items.length) return;

    this.cargando = true;
    this.nuevaCompra.Fecha = new Date();
    this.nuevaCompra.Total = this.totalCompra;
    this.nuevaCompra.ProductosId = this.nuevaCompra.Items.map(
      (item) => item.Frontend.Producto.Id,
    );

    this.comprasService.crear(this.nuevaCompra).subscribe({
      next: (_response: CompraModel) => {
        this.cargando = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Compra registrada',
          detail: `Total: ${this.totalCompra.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}`,
        });
        this.nuevaCompra = new CompraModel();
      },
      error: (err) => {
        this.cargando = false;
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo registrar la compra',
        });
      },
    });
  }

  // ── Descarga remito ─────────────────────────────────────────────────────

  descargar(compra: CompraModel): void {
    this.comprasService.descargarRemito(compra).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a   = document.createElement('a');
      a.href     = url;
      a.download = `remito-${compra.Id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  // ── Navegación ──────────────────────────────────────────────────────────

  verHistorialCompras(): void {
    this.router.navigateByUrl('compras/grilla');
  }

  // ── Combo ───────────────────────────────────────────────────────────────

  cargarProductosCombo(): void {
    this.productosService.obtenerTodos().subscribe({
      next: (response: ProductoModel[]) => {
        this.productosCombo = response.filter((p) => p.Activo);
      },
      error: (err) => console.error(err),
    });
  }
}
