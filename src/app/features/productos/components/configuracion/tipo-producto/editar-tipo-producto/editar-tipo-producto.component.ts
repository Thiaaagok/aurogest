import { Component, inject } from '@angular/core';
import { PrimeNgModule } from '../../../../../common/material/primeng.module';
import { CustomMaterialModule } from '../../../../../common/material/custom-material.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductoTiposService } from '../../../../services/producto-tipo.service';
import { ProductoTipoModel } from '../../../../models/producto-tipo.model';

@Component({
  selector: 'app-editar-tipo-producto',
  imports: [CustomMaterialModule, PrimeNgModule],
  templateUrl: './editar-tipo-producto.component.html',
  styleUrl: './editar-tipo-producto.component.scss',
})
export class EditarTipoProductoComponent {

  tipoProductoEditar: ProductoTipoModel = new ProductoTipoModel();
  parametro: string;
  cargando: boolean;

  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private productoTiposService = inject(ProductoTiposService);

  ngOnInit() {
    this.parametro = this.config.data;
    this.obtenerTipoProducto();
  }

  obtenerTipoProducto() {
    this.cargando = true;
    this.productoTiposService.obtenerPorId(this.parametro).subscribe({
      next: (response: ProductoTipoModel) => {
        this.cargando = false;
        this.tipoProductoEditar = response;
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
    this.productoTiposService.editar(this.tipoProductoEditar.Id, this.tipoProductoEditar)
      .subscribe({
        next: ((response: ProductoTipoModel) => {
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

  eliminarTipoProducto() {
    this.productoTiposService.eliminar(this.tipoProductoEditar.Id)
      .subscribe({
        next: ((response: boolean) => {
          this.cargando = false;
          this.obtenerTipoProducto();
        }),
        error: (err) => {
          this.cargando = false;
          console.log(err);
        },
        complete: () => { }
      })
  }

  reactivarTipoProducto() {
    this.productoTiposService.reactivar(this.tipoProductoEditar.Id)
      .subscribe({
        next: ((response: boolean) => {
          this.cargando = false;
          this.obtenerTipoProducto();
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
