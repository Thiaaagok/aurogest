import { Component, inject, OnInit } from '@angular/core';
import { FacturaVentaComponent } from './factura-venta/factura-venta.component';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { UtilitiesService } from '../../../common/services/utilities.services';
import { ProductoModel } from '../../../productos/models/producto.model';
import { ProductosService } from '../../../productos/services/producto.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ProductoSeleccionado } from './producto-seleccionado/producto-seleccionado';
import { VentaItem, VentaModel } from '../../models/venta.model';
import { VentasService } from '../../services/ventas';
import { Config } from '../../../common/config/config';

@Component({
  selector: 'app-pantalla-ventas',
  imports: [FacturaVentaComponent, PrimeNgModule, CustomMaterialModule],
  templateUrl: './pantalla-ventas.component.html',
  styleUrl: './pantalla-ventas.component.scss',
})
export class PantallaVentasComponent implements OnInit {
  cargando: boolean;
  productosFiltro: ProductoModel[] = [];
  ventasItem: VentaItem[] = [];
  venta: VentaModel = new VentaModel();
  productos: ProductoModel[] = [];
  apiUrl = Config.APIURL;

  filtroBusqueda = '';
  mostrarAutocomplete = false;
  indiceSeleccionado = 0;
  contadorEnter = 0;

  onInput() {
    const texto = this.filtroBusqueda?.toLowerCase().trim();

    if (!texto || texto.length < 1) {
      this.mostrarAutocomplete = false;
      this.productos = [];
      return;
    }

    this.productos = this.productosFiltro.filter(
      (p) =>
        p.Codigo?.toLowerCase().includes(texto) ||
        p.Descripcion?.toLowerCase().includes(texto),
    );

    this.mostrarAutocomplete = this.productos.length > 0;
    this.indiceSeleccionado = 0;
  }

  private utilitiesService = inject(UtilitiesService);
  private productosService = inject(ProductosService);
  private dialogService = inject(DialogService);
  private ventasService = inject(VentasService);

  ngOnInit() {
    this.utilitiesService.setTituloPagina('Venta');
    this.obtenerProductos();
  }

  obtenerProductos() {
    this.cargando = true;
    this.productosService.obtenerTodos().subscribe({
      next: (response: ProductoModel[]) => {
        this.cargando = false;
        this.productosFiltro = response.filter((p) => p.Activo);
        this.productos = [];
        this.mostrarAutocomplete = false;
      },
      error: (err) => {
        this.cargando = false;
        console.log(err);
      },
    });
  }

  filtrarProductos(filtro: string) {
    const texto = filtro?.trim().toLowerCase();

    if (!texto) {
      this.productos = this.productosFiltro.filter((p) => p.Activo);
      return;
    }

    this.productos = this.productosFiltro.filter(
      (producto) =>
        producto.Activo &&
        (producto.Codigo?.toLowerCase().includes(texto) ||
          producto.Descripcion?.toLowerCase().includes(texto)),
    );
  }

  productoSeleccionado(producto: ProductoModel) {
    const dialog = this.dialogService.open(ProductoSeleccionado, {
      width: '60%',
      height: 'fit-content',
      data: producto,
      modal: true,
      styleClass: 'backdrop-blur-sm !border-0 bg-transparent',
    });

    dialog.onClose.subscribe((resultado: any) => {
      if (resultado) {
        const productoId = resultado.producto.Id;

        const existente = this.ventasItem.find(
          (item) => item.ProductoId === productoId,
        );

        if (existente) {
          existente.Cantidad += resultado.cantidad;
          existente.Subtotal =
            existente.Cantidad * existente.PrecioUnitarioVenta;
        } else {
          const ventaItem: VentaItem = new VentaItem();
          ventaItem.ProductoId = productoId;
          ventaItem.Descripcion = resultado.producto.Descripcion;
          ventaItem.Cantidad = resultado.cantidad;
          ventaItem.PrecioUnitarioVenta = resultado.producto.PrecioVenta;
          ventaItem.Subtotal = resultado.subtotal;

          this.ventasItem.push(ventaItem);
        }

        this.ventasService.ventasItem.set(this.ventasItem);
      }
    });
  }

  seleccionarProducto(producto: ProductoModel) {
    this.mostrarAutocomplete = false;
    this.filtroBusqueda = '';
    this.onInput();
    this.productoSeleccionado(producto);
  }

  onKeyDown(event: KeyboardEvent) {
    if (!this.mostrarAutocomplete) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.indiceSeleccionado =
          (this.indiceSeleccionado + 1) % this.productos.length;
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.indiceSeleccionado =
          (this.indiceSeleccionado - 1 + this.productos.length) %
          this.productos.length;
        break;

      case 'Enter':
        this.contadorEnter++;
        setTimeout(() => (this.contadorEnter = 0), 350);

        if (this.contadorEnter === 2) {
          this.seleccionarProducto(this.productos[this.indiceSeleccionado]);
        }
        break;

      case 'Escape':
        this.mostrarAutocomplete = false;
        break;
    }
  }
}
