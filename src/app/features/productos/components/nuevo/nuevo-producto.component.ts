import { Component, inject, NgZone, Renderer2, ViewChild } from '@angular/core';
import { ProductoDetalleModel, ProductoModel } from '../../models/producto.model';
import { Router } from '@angular/router';
import { ProductosService } from '../../services/producto.service';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { SelectChosenComponent } from '../../../common/components/select-chosen/select-chosen.component';
import { ProductoTipoModel } from '../../models/producto-tipo.model';
import { ProveedorModel } from '../../../proveedores/models/proveedor.model';
import { ProveedoresService } from '../../../proveedores/services/proveedores.service';
import { ProductoCategoriaModel } from '../../models/producto-categoria.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductoTiposService } from '../../services/producto-tipo.service';
import { ProductoCategoriasService } from '../../services/producto-categoria.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { FloatLabel } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { MarcaModel } from '../../models/marca.model';
import { MarcasService } from '../../services/marcas.service';
import JsBarcode from 'jsbarcode';
import { v4 as uuidv4 } from 'uuid';
import { StockService } from '../../../stock/services/stock.service';
import { ProductoStock } from '../../../stock/models/producto-stock.model';

@Component({
  selector: 'app-nuevo-producto',
  imports: [
    PrimeNgModule,
    CustomMaterialModule,
    SelectChosenComponent,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    InputTextModule,
    ToastModule,
    FloatLabel,
    TextareaModule,
  ],
  templateUrl: './nuevo-producto.component.html',
  styleUrl: './nuevo-producto.component.scss',
})
export class NuevoProductoComponent {

  nuevoProducto: ProductoModel = new ProductoModel();
  cargando: boolean;
  tiposProductosCombo: ProductoTipoModel[] = [];
  marcasProductosCombo: MarcaModel[] = [];
  proveedoresCombo: ProveedorModel[] = [];
  categoriasProductosCombo: ProductoCategoriaModel[] = [];
  MinimoStock: number;

  private ref = inject(DynamicDialogRef);
  private productosService = inject(ProductosService);
  private proveedoresService = inject(ProveedoresService);
  private productoTiposService = inject(ProductoTiposService);
  private productoCategoriasService = inject(ProductoCategoriasService);
  private marcasService = inject(MarcasService)
  private stockService = inject(StockService);
  private ngZone = inject(NgZone);
  private renderer = inject(Renderer2);
  constructor() {
  }

  escaneando = false;
  bufferEscaneo = '';
  ultimoTiempo = 0;
  listenerFn: () => void;

  ngOnInit() {
    this.cargarTiposProductosCombo();
    this.cargarMarcasProductosCombo();
    this.cargarCategoriasProductosCombo();
    this.cargarProveedoresCombo();
    this.listenerFn = this.renderer.listen('window', 'keydown', (e: KeyboardEvent) => {
      if (this.modoCodigoBarra !== 'existente') return;
      const tagName = (e.target as HTMLElement).tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tagName) && (e.target as HTMLElement).id !== 'codigoBarra') {
        return;
      }

      const tiempoActual = Date.now();
      if (tiempoActual - this.ultimoTiempo > 50) {
        this.bufferEscaneo = '';
      }
      this.ultimoTiempo = tiempoActual;

      if (e.key === 'Enter') {
        if (this.bufferEscaneo.length > 0) {
          this.ngZone.run(() => {
            this.nuevoProducto.CodigoBarra = this.bufferEscaneo;
          });
          this.bufferEscaneo = '';
        }
      } else if (/^[0-9a-zA-Z]+$/.test(e.key)) {
        this.bufferEscaneo += e.key;
      }
    });
  }

  ngOnDestroy() {
    if (this.listenerFn) {
      this.listenerFn();
    }
  }


  onSubmit() {
    this.cargando = true;
    this.productosService.crear(this.nuevoProducto)
      .subscribe({
        next: (response: ProductoModel) => {
          const productoStock: ProductoStock = new ProductoStock();
          productoStock.Producto = response;
          productoStock.StockMinimo = this.MinimoStock;
          productoStock.StockActual = 0;
          productoStock.StockReservado = 0;
          this.stockService.crear(productoStock)
            .subscribe({
              next: (response: ProductoStock) => {
                this.cargando = false;
                this.limpiarModel();
                this.ref.close();
              },
              error: (err) => {
                this.cargando = false;
                console.log(err);
              },
              complete: () => { },
            });
        },
        error: (err) => {
          this.cargando = false;
          console.log(err);
        },
        complete: () => { },
      });
  }

  cerrar() {
    this.ref.close();
  }

  cargarTiposProductosCombo() {
    this.productoTiposService.obtenerTodos()
      .subscribe({
        next: (response: ProductoTipoModel[]) => {
          this.tiposProductosCombo = response;
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => { },
      });
  }

  cargarMarcasProductosCombo() {
    this.marcasService.obtenerTodos()
      .subscribe({
        next: (response: MarcaModel[]) => {
          this.marcasProductosCombo = response;
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => { },
      });
  }

  cargarCategoriasProductosCombo() {
    this.productoCategoriasService.obtenerTodos()
      .subscribe({
        next: (response: ProductoCategoriaModel[]) => {
          this.categoriasProductosCombo = response;
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => { },
      });
  }

  cargarProveedoresCombo() {
    this.proveedoresService.obtenerTodos()
      .subscribe({
        next: (response: ProveedorModel[]) => {
          this.proveedoresCombo = response;
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => { },
      });
  }

  limpiarModel() {
    this.nuevoProducto = new ProductoModel();
  }

  opcionesCodigoBarra = [
    { label: 'Escanear existente', value: 'existente' },
    { label: 'Generar propio', value: 'propio' }
  ];

  modoCodigoBarra = 'existente';

  opcionCambio(opcion: string) {
    this.nuevoProducto.CodigoBarra = '';
  }

  onModoCodigoBarraChange(modo: string) {
    if (modo === 'propio') {
      this.generarCodigoBarra();
    } else if (modo === 'existente') {
      this.nuevoProducto.CodigoBarra = '';
    }
  }
  generarCodigoBarra() {
    this.nuevoProducto.CodigoBarra = Math.floor(Math.random() * 1e13).toString().padStart(13, '0');
  }
  procesarCodigoEscaneado() {
    console.log("Código escaneado:", this.nuevoProducto.CodigoBarra);
  }

}
