import { Component, inject } from '@angular/core';
import { ProductoTipoModel } from '../../../models/producto-tipo.model';
import { ProductoTiposService } from '../../../services/producto-tipo.service';
import { GrillaUtilService } from '../../../../common/services/grilla-util.service';
import { Table } from 'primeng/table';
import { PrimeNgModule } from '../../../../common/material/primeng.module';
import { CustomMaterialModule } from '../../../../common/material/custom-material.module';
import { DialogService } from 'primeng/dynamicdialog';
import { EditarTipoProductoComponent } from './editar-tipo-producto/editar-tipo-producto.component';

@Component({
  selector: 'app-tipo-producto',
  imports: [CustomMaterialModule, PrimeNgModule],
  templateUrl: './tipo-producto.component.html',
  styleUrl: './tipo-producto.component.scss',
})
export class TipoProductoComponent { 

  nuevoTipoProducto: ProductoTipoModel = new ProductoTipoModel();
  tiposProducto: ProductoTipoModel[] = [];
  tiposProductoFiltro: ProductoTipoModel[] = [];

  cargando: boolean;
  registrosGrillaActivos: boolean;

  private productoTiposService = inject(ProductoTiposService);
  private GrillaUtilService = inject(GrillaUtilService);
  private dialogService = inject(DialogService);

  constructor() {
    this.registrosGrillaActivos = true;
  }

  ngOnInit() {
    this.obtenerTiposProducto();
  }

  obtenerTiposProducto() {
    this.cargando = true;
    this.productoTiposService.obtenerTodos()
      .subscribe({
        next: (response: ProductoTipoModel[]) => {
          this.cargando = false;
          this.tiposProductoFiltro = response;
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
    this.productoTiposService.crear(this.nuevoTipoProducto)
      .subscribe({
        next: (response: ProductoTipoModel) => {
          this.cargando = false;
          this.limpiarModel();
          this.obtenerTiposProducto();
        },
        error: (err) => {
          this.cargando = false;
          console.log(err);
        },
        complete: () => {},
      });
  }


  cargarGrilla() {
    this.tiposProducto = this.GrillaUtilService.cargarGrilla(
      this.tiposProductoFiltro,
      this.registrosGrillaActivos
    );
  }

  limpiarFiltrado(table: Table) {
    this.GrillaUtilService.limpiarFiltrado(table);
  }

  filtrarTiposProducto(table: Table, event: Event) {
    this.GrillaUtilService.filtrarGlobal(table, event);
  }

  editar(id: string) {
    const dialog = this.dialogService.open(EditarTipoProductoComponent, {
      header: 'Editar Tipo',
      width: '50%',
      height: 'fit-content',
      modal: true,
      data: id ,
      styleClass: 'backdrop-blur-sm !border-0 bg-transparent'
    });

    dialog.onClose
    .subscribe(() => {
      this.obtenerTiposProducto();
    })
  }

  limpiarModel(){
    this.nuevoTipoProducto = new ProductoTipoModel();
  }
}
