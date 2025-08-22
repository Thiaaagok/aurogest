import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ProductoModel } from '../../models/producto.model';
import { Router, RouterModule } from '@angular/router';
import { GrillaUtilService } from '../../../common/services/grilla-util.service';
import { Table } from 'primeng/table';
import { ProductosService } from '../../services/producto.service';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { FormsModule } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { NuevoProductoComponent } from '../nuevo/nuevo-producto.component';
import { EditarProductoComponent } from '../editar/editar-producto.component';
import { EditarPrecioComponent } from './editar-precio/editar-precio.component';

@Component({
  selector: 'app-grilla-productos',
  imports: [
    PrimeNgModule,
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    CustomMaterialModule,
    FormsModule],
  templateUrl: './grilla-productos.component.html',
  styleUrl: './grilla-productos.component.scss',
})
export class GrillaProductosComponent {

  @ViewChild('filter') filter!: ElementRef;

  productos: ProductoModel[] = [];
  productosFiltro: ProductoModel[] = [];

  cargando: boolean;
  registrosGrillaActivos: boolean;

  private productosService = inject(ProductosService);
  private dialogService = inject(DialogService);
  private GrillaUtilService = inject(GrillaUtilService);

  constructor() {
    this.registrosGrillaActivos = true;
  }

  ngOnInit() {
    this.obtenerProductos();
  }

  obtenerProductos() {
    this.cargando = true;
    this.productosService.obtenerTodos().subscribe({
      next: (response: ProductoModel[]) => {
        this.cargando = false;
        this.productosFiltro = response;
        this.cargarGrilla();
      },
      error: (err) => {
        this.cargando = false;
        console.log(err);
      },
      complete: () => { },
    });
  }

  crearProducto() {
    const dialog = this.dialogService.open(NuevoProductoComponent, {
      header: 'Crear Producto',
      width: '50%',
      height: 'fit-content',
      modal: true,
      data: {
      },
      styleClass: 'backdrop-blur-sm !border-0 bg-transparent'
    });

    dialog.onClose
      .subscribe(() => {
        this.obtenerProductos();
      })
  }

  editarProducto(id: string) {
    const dialog = this.dialogService.open(EditarProductoComponent, {
      header: 'Editar Producto',
      width: '50%',
      height: 'fit-content',
      data: id,
      modal: true,
      styleClass: 'backdrop-blur-sm !border-0 bg-transparent'
    });


    dialog.onClose
      .subscribe(() => {
        this.obtenerProductos();
      })
  }

  editarPrecioCompra(producto: ProductoModel) {
    const dialog = this.dialogService.open(EditarPrecioComponent, {
      header: 'Editar precio compra',
      width: '50%',
      height: 'fit-content',
      data: {
        Producto: producto,
        Tipo: 'COMPRA'
      },
      modal: true,
      styleClass: 'backdrop-blur-sm !border-0 bg-transparent'
    });


    dialog.onClose
      .subscribe(() => {
        this.obtenerProductos();
      })
  }

  editarPrecioVenta(producto: ProductoModel) {
    const dialog = this.dialogService.open(EditarPrecioComponent, {
      header: 'Editar precio venta',
      width: '50%',
      height: 'fit-content',
      data: {
        Producto: producto,
        Tipo: 'VENTA'
      },
      modal: true,
      styleClass: 'backdrop-blur-sm !border-0 bg-transparent'
    });


    dialog.onClose
      .subscribe(() => {
        this.obtenerProductos();
      })
  }

  cargarGrilla() {
    this.productos = this.GrillaUtilService.cargarGrilla(
      this.productosFiltro,
      this.registrosGrillaActivos
    )
  }

  limpiarFiltrado(table: Table) {
    this.GrillaUtilService.limpiarFiltrado(table);
  }

  filtrarProductos(table: Table, event: Event) {
    this.GrillaUtilService.filtrarGlobal(table, event);
  }

}
