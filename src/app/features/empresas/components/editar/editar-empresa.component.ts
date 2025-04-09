import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { EmpresaModel } from '../../models/empresa.model';
import { EmpresaService } from '../../services/empresa.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-editar-empresa',
  imports: [PrimeNgModule,CommonModule,RouterModule,FontAwesomeModule,CustomMaterialModule,FormsModule],
  templateUrl: './editar-empresa.component.html',
  styleUrl: './editar-empresa.component.scss',
})
export class EditarEmpresaComponent { 

  empresaEditar: EmpresaModel = new EmpresaModel();
  parametro: string;
  cargando: boolean;
  
  private activatedRoute = inject(ActivatedRoute);
  private empresaService = inject(EmpresaService);
  private router = inject(Router);

  constructor(){
    this.activatedRoute.params.subscribe(params => {
      this.parametro = params['id'];
      this.obtenerEmpresa();
    });
  }

  obtenerEmpresa() {
    this.cargando = true;
    this.empresaService.obtenerPorId(this.parametro).subscribe({
      next: (response: EmpresaModel) => {
        this.cargando = false;
        this.empresaEditar = response;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {},
    });
  }

  onSubmit(){
    this.cargando = true;
    this.empresaService.editar(this.empresaEditar.Id, this.empresaEditar)
    .subscribe({
      next: ((response: EmpresaModel) => {
        this.cargando = false;
        this.obtenerEmpresa();
      }),
      error: (err) => {
        console.log(err);
      },
      complete: () => {}
    })
  }

  eliminarEmpresa(){
    this.empresaService.eliminar(this.empresaEditar.Id)
    .subscribe({
      next: ((response: boolean) => {
        this.cargando = false;
        timer(300).subscribe(() => {
          this.obtenerEmpresa();
        })
      }),
      error: (err) => {
        console.log(err);
      },
      complete: () => {}
    })
  }

  reactivarEmpresa(){
    this.empresaService.reactivar(this.empresaEditar.Id)
    .subscribe({
      next: ((response: boolean) => {
        this.cargando = false;
        timer(300).subscribe(() => {
          this.obtenerEmpresa();
        })
      }),
      error: (err) => {
        console.log(err);
      },
      complete: () => {}
    })
  }

  volver(){
    this.router.navigateByUrl('empresas');
  }
}
