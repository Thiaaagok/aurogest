import { Component, inject, NgZone, Renderer2 } from '@angular/core';
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
import { ProveedoresService } from '../../../proveedores/services/proveedores.service';
import { ProductosService } from '../../../productos/services/producto.service';
import { StockService } from '../../../stock/services/stock.service';
import { ProductoStock } from '../../../stock/models/producto-stock.model';

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
  nuevaCompra: CompraModel = new CompraModel();
  nuevoItem: CompraItemModel = new CompraItemModel();
  productoSeleccionado: ProductoModel;

  productosCombo: ProductoModel[] = [];
  proveedoresCombo: ProveedorModel[] = [];

  codigoBarra: string;
  cargando: boolean;

  private comprasService = inject(ComprasService);
  private productosService = inject(ProductosService);
  private productoStockService = inject(StockService);
  private ngZone = inject(NgZone);
  private renderer = inject(Renderer2);

  escaneando = false;
  bufferEscaneo = '';
  ultimoTiempo = 0;
  listenerFn: () => void;

  ngOnInit() {
    this.cargarProductosCombo();
    this.listenerFn = this.renderer.listen('window', 'keydown', (e: KeyboardEvent) => {
      const tagName = (e.target as HTMLElement).tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tagName) && (e.target as HTMLElement).id !== 'codigoBarra') {
        return;
      }

      // Si el lector manda ENTER al final del escaneo
      if (e.key === 'Enter') {
        if (this.bufferEscaneo.length > 0) {
          console.log('Se escaneó:', this.bufferEscaneo);
          this.ngZone.run(() => {
            this.codigoBarra = this.bufferEscaneo;
            console.log(this.codigoBarra);
            this.productoStockService.obtenerProductoStockPorCodigoBarra(this.codigoBarra).subscribe({
              next: (response: ProductoStock) => {
                console.log('se encontro');
                console.log(response);
              },
              error: (err) => {
                this.cargando = false;
                console.log(err);
              },
              complete: () => { },
            });
          });
          this.bufferEscaneo = '';
        }
      } else {
        // Solo agregamos teclas de un carácter (evitamos Shift, Ctrl, etc.)
        if (e.key.length === 1) {
          this.bufferEscaneo += e.key;
        }
      }
    });
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
