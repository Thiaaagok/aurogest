import { Component, inject, OnInit } from '@angular/core';
import { MuestraProductosComponent } from './muestra-productos/muestra-productos.component';
import { FacturaVentaComponent } from './factura-venta/factura-venta.component';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { UtilitiesService } from '../../../common/services/utilities.services';
import { ProductoModel } from '../../../productos/models/producto.model';
import { ProductosService } from '../../../productos/services/producto.service';

@Component({
  selector: 'app-pantalla-ventas',
  imports: [MuestraProductosComponent, FacturaVentaComponent, PrimeNgModule, CustomMaterialModule],
  templateUrl: './pantalla-ventas.component.html',
  styleUrl: './pantalla-ventas.component.scss',
})
export class PantallaVentasComponent implements OnInit {

  cargando: boolean;
  productosFiltro: ProductoModel[] = [];
  productos: ProductoModel[] = [];

  private utilitiesService = inject(UtilitiesService);
  private productosService = inject(ProductosService);

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

    console.log(this.productos);
  }

}
