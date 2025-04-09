import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { ProveedorModel } from '../../models/proveedor.model';
import { ProveedoresService } from '../../services/proveedores.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-editar-proveedor',
  imports: [PrimeNgModule,CommonModule,RouterModule,FontAwesomeModule,CustomMaterialModule,FormsModule],
  templateUrl: './editar-proveedor.component.html',
  styleUrl: './editar-proveedor.component.scss',
})
export class EditarProveedorComponent { 
  proveedorEditar: ProveedorModel = new ProveedorModel();
  parametro: string;
  cargando: boolean;
  
  private activatedRoute = inject(ActivatedRoute);
  private proveedorService = inject(ProveedoresService);
  private router = inject(Router);

  constructor(){
    this.activatedRoute.params.subscribe(params => {
      this.parametro = params['id'];
      this.obtenerProveedor();
    });
  }

  obtenerProveedor() {
    this.cargando = true;
    this.proveedorService.obtenerPorId(this.parametro).subscribe({
      next: (response: ProveedorModel) => {
        this.cargando = false;
        this.proveedorEditar = response;
      },
      error: (err) => {
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
        this.obtenerProveedor();
      }),
      error: (err) => {
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
        timer(300).subscribe(() => {
          this.obtenerProveedor();
        })
      }),
      error: (err) => {
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
        timer(300).subscribe(() => {
          this.obtenerProveedor();
        })
      }),
      error: (err) => {
        console.log(err);
      },
      complete: () => {}
    })
  }

  volver(){
    this.router.navigateByUrl('proveedores');
  }
}
