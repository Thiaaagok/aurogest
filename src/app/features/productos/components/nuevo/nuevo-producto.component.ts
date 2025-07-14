import { Component, inject, ViewChild } from '@angular/core';
import { ProductoDetalleModel, ProductoModel } from '../../models/producto.model';
import { Router } from '@angular/router';
import { ProductosService } from '../../services/producto.service';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { SelectChosenComponent } from '../../../common/components/select-chosen/select-chosen.component';
import { ProductoTipoModel } from '../../models/producto-tipo.model';
import { MarcaModel } from '../../../marcas/models/marca.model';
import { ProveedorModel } from '../../../proveedores/models/proveedor.model';
import { ProveedoresService } from '../../../proveedores/services/proveedores.service';
import { ProductoCategoriaModel } from '../../models/producto-categoria.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductoTiposService } from '../../services/producto-tipo.service';
import { ProductoCategoriasService } from '../../services/producto-categoria.service';
import { MarcasService } from '../../../marcas/services/marcas.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { FloatLabel } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-nuevo-producto',
  imports: [PrimeNgModule, CustomMaterialModule, SelectChosenComponent, ReactiveFormsModule, FormsModule, CommonModule,
    InputTextModule,
    ToastModule,
    FloatLabel,
    TextareaModule
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

  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private productosService = inject(ProductosService);
  private proveedoresService = inject(ProveedoresService);
  private productoTiposService = inject(ProductoTiposService);
  private productoCategoriasService = inject(ProductoCategoriasService);
  private marcasService = inject(MarcasService)

  constructor(){
  }

  ngOnInit() {
    this.cargarTiposProductosCombo();
    this.cargarMarcasProductosCombo();
    this.cargarCategoriasProductosCombo();
    this.cargarProveedoresCombo();
  }

  onSubmit() {
    this.cargando = true;
    this.productosService.crear(this.nuevoProducto)
      .subscribe({
        next: (response: ProductoModel) => {
          this.cargando = false;
          this.limpiarModel();
        },
        error: (err) => {
          this.cargando = false;
          console.log(err);
        },
        complete: () => {},
      });
  }

  cerrar() {
    this.ref.close();
  }

  cargarTiposProductosCombo(){
    this.productoTiposService.obtenerTodos()
    .subscribe({
      next: (response: ProductoTipoModel[]) => {
        this.tiposProductosCombo = response;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {},
    });
  }

  cargarMarcasProductosCombo(){
    this.marcasService.obtenerTodos()
    .subscribe({
      next: (response: MarcaModel[]) => {
        this.marcasProductosCombo = response;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {},
    });
  }

  cargarCategoriasProductosCombo(){
    this.productoCategoriasService.obtenerTodos()
    .subscribe({
      next: (response: ProductoCategoriaModel[]) => {
        this.categoriasProductosCombo = response;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {},
    });
  }

  cargarProveedoresCombo(){
    this.proveedoresService.obtenerTodos()
    .subscribe({
      next: (response: ProveedorModel[]) => {
        this.proveedoresCombo = response;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {},
    });
  }

  limpiarModel(){
    this.nuevoProducto = new ProductoModel();
  }
  
}
