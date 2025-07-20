import { Component, inject } from '@angular/core';
import { PrimeNgModule } from '../../../../../common/material/primeng.module';
import { CustomMaterialModule } from '../../../../../common/material/custom-material.module';
import { ProductoCategoriaModel } from '../../../../models/producto-categoria.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductoCategoriasService } from '../../../../services/producto-categoria.service';

@Component({
  selector: 'app-editar-categoria-producto',
  imports: [CustomMaterialModule, PrimeNgModule],
  templateUrl: './editar-categoria-producto.component.html',
  styleUrl: './editar-categoria-producto.component.scss',
})
export class EditarCategoriaProductoComponent {
  categoriaProductoEditar: ProductoCategoriaModel = new ProductoCategoriaModel();
  parametro: string;
  cargando: boolean;

  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private productoCategoriaService = inject(ProductoCategoriasService);

  ngOnInit() {
    this.parametro = this.config.data;
    this.obtenerCategoriaProducto();
  }

  obtenerCategoriaProducto() {
    this.cargando = true;
    this.productoCategoriaService.obtenerPorId(this.parametro).subscribe({
      next: (response: ProductoCategoriaModel) => {
        this.cargando = false;
        this.categoriaProductoEditar = response;
      },
      error: (err) => {
        this.cargando = false;
        console.log(err);
      },
      complete: () => { },
    });
  }

  onSubmit() {
    this.cargando = true;
    this.productoCategoriaService.editar(this.categoriaProductoEditar.Id, this.categoriaProductoEditar)
      .subscribe({
        next: ((response: ProductoCategoriaModel) => {
          this.cargando = false;
          this.ref.close();
        }),
        error: (err) => {
          this.cargando = false;
          console.log(err);
        },
        complete: () => { }
      })
  }

  eliminarCategoriaProducto() {
    this.productoCategoriaService.eliminar(this.categoriaProductoEditar.Id)
      .subscribe({
        next: ((response: boolean) => {
          this.cargando = false;
          this.obtenerCategoriaProducto();
        }),
        error: (err) => {
          this.cargando = false;
          console.log(err);
        },
        complete: () => { }
      })
  }

  reactivarCategoriaProducto() {
    this.productoCategoriaService.reactivar(this.categoriaProductoEditar.Id)
      .subscribe({
        next: ((response: boolean) => {
          this.cargando = false;
          this.obtenerCategoriaProducto();
        }),
        error: (err) => {
          this.cargando = false;
          console.log(err);
        },
        complete: () => { }
      })
  }

  cerrar() {
    this.ref.close();
  }
}
