import { Component, inject } from '@angular/core';
import { ProveedoresService } from '../../services/proveedores.service';
import { Router, RouterModule } from '@angular/router';
import { ProveedorModel } from '../../models/proveedor.model';
import { FormsModule } from '@angular/forms';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { FloatLabel } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-nuevo-proveedor',
  imports: [
    PrimeNgModule,
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    CustomMaterialModule,
    FormsModule,
    InputTextModule,
    ToastModule,
    FloatLabel,
    TextareaModule],
  templateUrl: './nuevo-proveedor.component.html',
  styleUrl: './nuevo-proveedor.component.scss',
})
export class NuevoProveedorComponent { 
  nuevoProveedor: ProveedorModel = new ProveedorModel();
  cargando: boolean;

  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private proveedorService = inject(ProveedoresService);

  onSubmit() {
    this.cargando = true;
    this.proveedorService.crear(this.nuevoProveedor).subscribe({
      next: (response: ProveedorModel) => {
        this.cargando = false;
        this.limpiarModel();
        this.ref.close();
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {},
    });
  }

  limpiarModel(){
    this.nuevoProveedor = new ProveedorModel();
  }

  cerrar() {
    this.ref.close();
  }

}
