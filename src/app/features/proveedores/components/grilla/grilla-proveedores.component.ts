import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { ProveedorModel } from '../../models/proveedor.model';
import { ProveedoresService } from '../../services/proveedores.service';
import { GrillaUtilService } from '../../../common/services/grilla-util.service';
import { Table } from 'primeng/table';

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
  private router = inject(Router);
  private proveedoresService = inject(ProveedoresService);

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

  crearProveedor(){
    this.router.navigateByUrl(`proveedores/nueva`);
  }

  editarProveedor(id: string){
    this.router.navigateByUrl(`proveedores/editar/${id}`);
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
}
