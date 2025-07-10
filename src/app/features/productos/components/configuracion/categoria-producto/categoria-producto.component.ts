import { Component, inject } from '@angular/core';
import { PrimeNgModule } from '../../../../common/material/primeng.module';
import { CustomMaterialModule } from '../../../../common/material/custom-material.module';
import { ProductoCategoriaModel } from '../../../models/producto-categoria.model';
import { ProductoTiposService } from '../../../services/producto-tipo.service';
import { GrillaUtilService } from '../../../../common/services/grilla-util.service';
import { Table } from 'primeng/table';
import { ProductoCategoriasService } from '../../../services/producto-categoria.service';

@Component({
  selector: 'app-categoria-producto',
  imports: [CustomMaterialModule, PrimeNgModule],
  templateUrl: './categoria-producto.component.html',
  styleUrl: './categoria-producto.component.scss',
})
export class CategoriaProductoComponent { 

  nuevaCategoriaProducto: ProductoCategoriaModel = new ProductoCategoriaModel();
  categorias: ProductoCategoriaModel[] = [];
  categoriasFiltro: ProductoCategoriaModel[] = [];

  cargando: boolean;
  registrosGrillaActivos: boolean;

  private productoCategoriasService = inject(ProductoCategoriasService);
  private GrillaUtilService = inject(GrillaUtilService);
  

  constructor() {
    this.registrosGrillaActivos = true;
  }

  ngOnInit() {
    this.obtenerCategorias();
  }

  obtenerCategorias() {
    this.cargando = true;
    this.productoCategoriasService.obtenerTodos()
      .subscribe({
        next: (response: ProductoCategoriaModel[]) => {
          this.cargando = false;
          this.categoriasFiltro = response;
          this.cargarGrilla();
        },
        error: (err) => {
          this.cargando = false;
          console.log(err);
        },
        complete: () => {},
      });
  }

  onSubmit(){
    this.cargando = true;
    this.productoCategoriasService.crear(this.nuevaCategoriaProducto)
      .subscribe({
        next: (response: ProductoCategoriaModel) => {
          this.cargando = false;
          this.limpiarModel();
          this.obtenerCategorias();
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {},
      });
  }


  cargarGrilla() {
    this.categorias = this.GrillaUtilService.cargarGrilla(
      this.categoriasFiltro,
      this.registrosGrillaActivos
    );
  }

  limpiarFiltrado(table: Table) {
    this.GrillaUtilService.limpiarFiltrado(table);
  }

  filtrarCategorias(table: Table, event: Event) {
    this.GrillaUtilService.filtrarGlobal(table, event);
  }

  editar(id:string){}

  limpiarModel(){
    this.nuevaCategoriaProducto = new ProductoCategoriaModel();
  }
}
