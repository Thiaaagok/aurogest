import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { EmpresaModel } from '../../models/empresa.model';
import { EmpresaService } from '../../services/empresa.service';
import { timer } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { FloatLabel } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-editar-empresa',
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
  templateUrl: './editar-empresa.component.html',
  styleUrl: './editar-empresa.component.scss',
})
export class EditarEmpresaComponent implements OnInit { 

  empresaEditar: EmpresaModel = new EmpresaModel();
  parametro: string;
  cargando: boolean;
  
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private empresaService = inject(EmpresaService);

  ngOnInit(){
    this.parametro = this.config.data;
    this.obtenerEmpresa();
  }

  obtenerEmpresa() {
    this.cargando = true;
    this.empresaService.obtenerPorId(this.parametro).subscribe({
      next: (response: EmpresaModel) => {
        this.cargando = false;
        this.empresaEditar = response;
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
    this.empresaService.editar(this.empresaEditar.Id, this.empresaEditar)
    .subscribe({
      next: ((response: EmpresaModel) => {
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

  eliminarEmpresa(){
    this.empresaService.eliminar(this.empresaEditar.Id)
    .subscribe({
      next: ((response: boolean) => {
        this.cargando = false;
        this.obtenerEmpresa();
      }),
      error: (err) => {
        this.cargando = false;
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
        this.obtenerEmpresa();
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
