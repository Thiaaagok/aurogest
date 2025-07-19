import { Component, inject } from '@angular/core';
import { PrimeNgModule } from '../../../../../common/material/primeng.module';
import { CustomMaterialModule } from '../../../../../common/material/custom-material.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MarcaModel } from '../../../../models/marca.model';
import { MarcasService } from '../../../../services/marcas.service';

@Component({
  selector: 'app-editar-marcas',
  imports: [CustomMaterialModule, PrimeNgModule],
  templateUrl: './editar-marcas.component.html',
  styleUrl: './editar-marcas.component.scss',
})
export class EditarMarcasComponent {
  marcaEditar: MarcaModel = new MarcaModel();
  parametro: string;
  cargando: boolean;

  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private marcasService = inject(MarcasService);

  ngOnInit() {
    this.parametro = this.config.data;
    this.obtenerMarca();
  }

  obtenerMarca() {
    this.cargando = true;
    this.marcasService.obtenerPorId(this.parametro).subscribe({
      next: (response: MarcaModel) => {
        this.cargando = false;
        this.marcaEditar = response;
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
    this.marcasService.editar(this.marcaEditar.Id, this.marcaEditar)
      .subscribe({
        next: ((response: MarcaModel) => {
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

  eliminarMarca() {
    this.marcasService.eliminar(this.marcaEditar.Id)
      .subscribe({
        next: ((response: boolean) => {
          this.cargando = false;
          this.obtenerMarca();
        }),
        error: (err) => {
          this.cargando = false;
          console.log(err);
        },
        complete: () => { }
      })
  }

  reactivarMarca() {
    this.marcasService.reactivar(this.marcaEditar.Id)
      .subscribe({
        next: ((response: boolean) => {
          this.cargando = false;
          this.obtenerMarca();
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
