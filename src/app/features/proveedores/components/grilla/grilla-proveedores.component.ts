import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { ProveedorModel } from '../../models/proveedor.model';
import { ProveedoresService } from '../../services/proveedores.service';
import { GrillaUtilService } from '../../../common/services/grilla-util.service';
import { Table } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { NuevoProveedorComponent } from '../nuevo/nuevo-proveedor.component';
import { EditarProveedorComponent } from '../editar/editar-proveedor.component';

@Component({
  selector: 'app-grilla-proveedores',
  imports: [PrimeNgModule,CommonModule,RouterModule,FontAwesomeModule,CustomMaterialModule,FormsModule],
  templateUrl: './grilla-proveedores.component.html',
  styleUrl: './grilla-proveedores.component.scss',
})
export class GrillaProveedoresComponent { 
  @ViewChild('filter')filter!: ElementRef;

  proveedores: ProveedorModel[] = [];
  proveedoresFiltro: ProveedorModel[] = [];
  registrosGrillaActivos: boolean;
  cargando: boolean;

  private GrillaUtilService = inject(GrillaUtilService);
  private proveedoresService = inject(ProveedoresService);
  private dialogService = inject(DialogService);

  ngOnInit(){
    this.registrosGrillaActivos = true;
    this.obtenerProveedores();
  }

  obtenerProveedores(){
    this.cargando = true;
    this.proveedoresService.obtenerTodos()
    .subscribe({
      next: ((response: ProveedorModel[]) => {
        this.cargando = false;
        this.proveedoresFiltro = response;
        this.cargarGrilla();
      }),
      error: (err) => {
        console.error(err);
      },
      complete: () => {}
    })
  }

  cargarGrilla(){
    this.proveedores = this.GrillaUtilService.cargarGrilla(this.proveedoresFiltro, this.registrosGrillaActivos);
  }

  filtrarProveedores(table: Table, event: Event){
    this.GrillaUtilService.filtrarGlobal(table, event);
  }

  limpiarFiltrado(table: Table){
    this.GrillaUtilService.limpiarFiltrado(table);
  }

  crearProveedor() {
    this.dialogService.open(NuevoProveedorComponent, {
      header: 'Crear Proveedor',
      width: '50%',
      height: 'fit-content',
      modal: true,
      data: {
      },
      styleClass: 'backdrop-blur-sm !border-0 bg-transparent'
    });
  }

  editarProveedor(id: string) {
    this.dialogService.open(EditarProveedorComponent, {
      header: 'Editar Proveedor',
      width: '50%',
      height: 'fit-content',
      modal: true,
      data: id ,
      styleClass: 'backdrop-blur-sm !border-0 bg-transparent'
    });
  }
}
