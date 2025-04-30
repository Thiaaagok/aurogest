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

  private router = inject(Router);
  private productosService = inject(ProductosService);
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
      complete: () => {},
    });
  }

  crearProducto() {
    this.router.navigateByUrl(`productos/nuevo`);
  }

  editarProducto(id: string) {
    this.router.navigateByUrl(`productos/editar/${id}`);
  }

  cargarGrilla() {
    this.productos = this.GrillaUtilService.cargarGrilla(
      this.productosFiltro,
      this.registrosGrillaActivos
    );
  }

  limpiarFiltrado(table: Table) {
    this.GrillaUtilService.limpiarFiltrado(table);
  }

  filtrarProductos(table: Table, event: Event) {
    this.GrillaUtilService.filtrarGlobal(table, event);
  }

}
