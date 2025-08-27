import { Component, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PrimeNgModule } from '../../../../common/material/primeng.module';
import { CustomMaterialModule } from '../../../../common/material/custom-material.module';
import { RegistroActualizacionPrecio } from '../../../../registros/models/registroActualizacionPrecio.model';
import { ProductosService } from '../../../services/producto.service';
import { GrillaUtilService } from '../../../../common/services/grilla-util.service';
import { RegistrosProductosService } from '../../../../registros/services/registros-productos.service';
import { ProductoModel } from '../../../models/producto.model';

@Component({
  selector: 'app-editar-precio',
  imports: [PrimeNgModule, CustomMaterialModule],
  templateUrl: './editar-precio.component.html',
  styleUrl: './editar-precio.component.scss',
})
export class EditarPrecioComponent {

  parametro: any;
  productoEditar: ProductoModel;
  nuevoPrecio: number;
  cargando: boolean;
  registrosAnterioresFiltro: RegistroActualizacionPrecio[] = [];
  registrosAnteriores: RegistroActualizacionPrecio[] = [];

  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private productosService = inject(ProductosService);
  private registrosService = inject(RegistrosProductosService);

  constructor() {
    this.parametro = this.config.data;
    this.productoEditar = this.parametro.Producto;
    this.obtenerActualizacionesAnteriores();
  }

  obtenerActualizacionesAnteriores() {
    this.cargando = true;
    this.registrosService.obtenerPorProducto(this.productoEditar.Id).subscribe({
      next: (response: RegistroActualizacionPrecio[]) => {
        this.cargando = false;
        this.registrosAnterioresFiltro = response;
        this.cargarGrilla();
      },
      error: (err) => {
        this.cargando = false;
        console.log(err);
      },
      complete: () => { },
    });
  }

  onSubmit() {
    if (!this.nuevoPrecio || this.nuevoPrecio <= 0) {
      console.warn('Ingrese un precio válido');
      return;
    }
    this.cargando = true;
    this.productosService.editarPrecio(this.productoEditar.Id, this.nuevoPrecio, this.parametro.Tipo)
      .subscribe({
        next: (productoActualizado) => {
          this.cargando = false;
          this.ref.close({
            resultado: true,
            nuevoPrecio: this.nuevoPrecio
          });
        },
        error: (err) => {
          console.error('Error al actualizar precio', err);
          this.cargando = false;
        },
        complete: () => { }
      });
  }

  cargarGrilla() {
    this.registrosAnteriores = this.registrosAnterioresFiltro.filter(registro => registro.Tipo == this.parametro.Tipo);
  }

  cerrar() {
    this.ref.close();
  }
}
