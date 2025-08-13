import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { ProveedorModel } from '../../models/proveedor.model';
import { ProveedoresService } from '../../services/proveedores.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { FloatLabel } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-editar-proveedor',
  imports: [PrimeNgModule,
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    CustomMaterialModule,
    FormsModule,
    InputTextModule,
    ToastModule,
    FloatLabel,
    TextareaModule],
  templateUrl: './editar-proveedor.component.html',
  styleUrl: './editar-proveedor.component.scss',
})
export class EditarProveedorComponent { 
  proveedorEditar: ProveedorModel = new ProveedorModel();
  parametro: string;
  cargando: boolean;
  
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private proveedorService = inject(ProveedoresService);

  ngOnInit(){
    this.parametro = this.config.data;
    this.obtenerProveedor();
  }

  obtenerProveedor() {
    this.cargando = true;
    this.proveedorService.obtenerPorId(this.parametro).subscribe({
      next: (response: ProveedorModel) => {
        this.cargando = false;
        this.proveedorEditar = response;
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
    this.proveedorService.editar(this.proveedorEditar.Id, this.proveedorEditar)
    .subscribe({
      next: ((response: ProveedorModel) => {
        this.cargando = false;
        this.ref.close();
      }),
      error: (err) => {
        this.cargando = false;
        console.log(err);
      },
      complete: () => {}
    })
  }

  eliminarProveedor(){
    this.proveedorService.eliminar(this.proveedorEditar.Id)
    .subscribe({
      next: ((response: boolean) => {
        this.cargando = false;
        this.obtenerProveedor();
      }),
      error: (err) => {
        this.cargando = false;
        console.log(err);
      },
      complete: () => {}
    })
  }

  reactivarProveedor(){
    this.proveedorService.reactivar(this.proveedorEditar.Id)
    .subscribe({
      next: ((response: boolean) => {
        this.cargando = false;
        this.obtenerProveedor();
      }),
      error: (err) => {
        this.cargando = false;
        console.log(err);
      },
      complete: () => {}
    })
  }

  cerrar() {
    this.ref.close();
  }

}
