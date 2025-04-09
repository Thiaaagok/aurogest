import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { Table } from 'primeng/table';
import { EmpresaModel } from '../../models/empresa.model';
import { GrillaUtilService } from '../../../common/services/grilla-util.service';
import { UsuariosService } from '../../../usuarios/services/usuarios.service';
import { EmpresaService } from '../../services/empresa.service';

@Component({
  selector: 'app-grilla-empresas',
  imports: [PrimeNgModule,CommonModule,RouterModule,FontAwesomeModule,CustomMaterialModule,FormsModule],
  templateUrl: './grilla-empresas.component.html',
  styleUrl: './grilla-empresas.component.scss',
})
export class GrillaEmpresasComponent { 

  @ViewChild('filter')filter!: ElementRef;

  empresas: EmpresaModel[] = [];
  empresasFiltro: EmpresaModel[] = [];
  registrosGrillaActivos: boolean;
  cargando: boolean;

  private GrillaUtilService = inject(GrillaUtilService);
  private router = inject(Router);
  private empresasService = inject(EmpresaService);

  ngOnInit(){
    this.registrosGrillaActivos = true;
    this.obtenerEmpresas();
  }

  obtenerEmpresas(){
    this.cargando = true;
    this.empresasService.obtenerTodos()
    .subscribe({
      next: ((response: EmpresaModel[]) => {
        this.cargando = false;
        this.empresasFiltro = response;
        this.cargarGrilla();
      }),
      error: (err) => {
        console.error(err);
      },
      complete: () => {}
    })
  }

  crearEmpresa(){
    this.router.navigateByUrl(`empresas/nueva`);
  }

  editarEmpresa(id: string){
    this.router.navigateByUrl(`empresas/editar/${id}`);
  }

  cargarGrilla(){
    this.empresas = this.GrillaUtilService.cargarGrilla(this.empresasFiltro, this.registrosGrillaActivos);
  }

  filtrarEmpresas(table: Table, event: Event){
    this.GrillaUtilService.filtrarGlobal(table, event);
  }

  limpiarFiltrado(table: Table){
    this.GrillaUtilService.limpiarFiltrado(table);
  }
}
