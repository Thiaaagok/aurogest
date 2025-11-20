import { Component, inject, OnInit } from '@angular/core';
import { MuestraProductosComponent } from './muestra-productos/muestra-productos.component';
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

@Component({
  selector: 'app-pantalla-ventas',
  imports: [MuestraProductosComponent, FacturaVentaComponent, PrimeNgModule, CustomMaterialModule],
  templateUrl: './pantalla-ventas.component.html',
  styleUrl: './pantalla-ventas.component.scss',
})
export class PantallaVentasComponent implements OnInit {

  cargando: boolean;
  productosFiltro: ProductoModel[] = [];
  ventasItem: VentaItem[] = [];
  venta: VentaModel = new VentaModel();
  productos: ProductoModel[] = [];

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
        this.productosFiltro = response;
        this.productos = this.productosFiltro.filter(producto => producto.Activo);
      },
      error: (err) => {
        this.cargando = false;
        console.log(err);
      },
      complete: () => { },
    });
  }

  filtrarProductos(filtro: string) {
    console.log('filtro', filtro);
    if (!filtro || filtro.trim() === '') {
      this.productos = this.productosFiltro.filter(p => p.Activo);
      return;
    }
    const texto = filtro.toLowerCase();
    this.productos = this.productosFiltro.filter(producto =>
      producto.Activo &&
      (
        producto.Codigo.toLowerCase().includes(texto) ||
        producto.Descripcion.toLowerCase().includes(texto)
      )
    );
  }

  productoSeleccionado(producto: ProductoModel) {
    const dialog = this.dialogService.open(ProductoSeleccionado, {
      width: '40%',
      height: 'fit-content',
      data: producto,
      modal: true,
      styleClass: 'backdrop-blur-sm !border-0 bg-transparent'
    });


    dialog.onClose.subscribe((resultado: any) => {
      if (resultado) {

        const productoId = resultado.producto.Id;

        const existente = this.ventasItem.find(item => item.ProductoId === productoId);

        if (existente) {
          existente.Cantidad += resultado.cantidad;
          existente.Subtotal = existente.Cantidad * existente.PrecioUnitarioVenta;
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

}
