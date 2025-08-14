import { Component, inject, NgZone, Renderer2, ViewChild } from '@angular/core';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { FloatLabel } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { ComprasService } from '../../services/compras.service';
import { CompraItemModel, CompraModel } from '../../models/compra.model';
import { ProductoModel } from '../../../productos/models/producto.model';
import { ProveedorModel } from '../../../proveedores/models/proveedor.model';
import { SelectChosenComponent } from '../../../common/components/select-chosen/select-chosen.component';
import { ProductosService } from '../../../productos/services/producto.service';
import { QrScannerService } from '../../../common/services/qrScanner.service';
@Component({
  selector: 'app-nueva-compra',
  imports: [PrimeNgModule,
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    SelectChosenComponent,
    CustomMaterialModule,
    FormsModule,
    InputTextModule,
    ToastModule,
    FloatLabel,
    TextareaModule],
  templateUrl: './nueva-compra.component.html',
  styleUrl: './nueva-compra.component.scss',
})
export class NuevaCompraComponent {

  @ViewChild(SelectChosenComponent) select: SelectChosenComponent;

  nuevaCompra: CompraModel = new CompraModel();
  nuevoItem: CompraItemModel = new CompraItemModel();
  productoSeleccionado: ProductoModel;

  productosCombo: ProductoModel[] = [];
  proveedoresCombo: ProveedorModel[] = [];

  codigoBarra: string;
  cargando: boolean;

  private comprasService = inject(ComprasService);
  private productosService = inject(ProductosService);
  private qrService = inject(QrScannerService);

  ngOnInit() {
    this.cargarProductosCombo();
    this.qrService.qrScanned.subscribe((qr: string) => {
      this.codigoBarra = qr;
      console.log('QR escaneado:', qr);
      this.obtenerProductoEscaneado();
    });
  }

  obtenerProductoEscaneado() {
    this.productosService.obtenerProductoPorCodigoBarra(this.codigoBarra)
      .subscribe({
        next: (response: ProductoModel) => {
          const producto = this.productosCombo.find(p => p.Id === response.Id);
          if (producto) {
            console.log(producto)
            this.nuevoItem.Producto = producto;
            this.proveedoresCombo = producto.Proveedores;
          } 
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => { },
      })
  }

  editarItem(id: string) {

  }

  onSubmit() {
    this.cargando = true;
    this.comprasService.crear(this.nuevaCompra).subscribe({
      next: (response: CompraModel) => {
        this.cargando = false;
        this.limpiarModel();
      },
      error: (err) => {
        this.cargando = false;
        console.log(err);
      },
      complete: () => { },
    });
  }

  cargarProductosCombo() {
    this.productosService.obtenerTodos()
      .subscribe({
        next: (response: ProductoModel[]) => {
          this.productosCombo = response;
          this.productosCombo.forEach(prod => prod.Descripcion = prod.Nombre);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => { },
      });
  }

  crearNuevoItem() {
    this.nuevoItem.Subtotal = this.nuevoItem.Producto.PrecioCompra * this.nuevoItem.Cantidad;
    this.nuevaCompra.Items.push(this.nuevoItem);
    this.nuevoItem = new CompraItemModel();
  }

  limpiarModel() {
    this.nuevaCompra = new CompraModel();
  }

  productoSeleccionadoEvent(producto: ProductoModel) {
    if (producto) {
      this.proveedoresCombo = producto.Proveedores;
    }
  }
}
