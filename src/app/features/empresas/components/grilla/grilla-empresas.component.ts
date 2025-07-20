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
import { DialogService } from 'primeng/dynamicdialog';
import { NuevaEmpresaComponent } from '../nueva/nueva-empresa.component';
import { EditarEmpresaComponent } from '../editar/editar-empresa.component';

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
  private dialogService = inject(DialogService);

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

  crearEmpresa() {
    this.dialogService.open(NuevaEmpresaComponent, {
      header: 'Crear Empresa',
      width: '50%',
      height: 'fit-content',
      modal: true,
      data: {
      },
      styleClass: 'backdrop-blur-sm !border-0 bg-transparent'
    });
  }

  editarEmpresa(id: string) {
    const dialog = this.dialogService.open(EditarEmpresaComponent, {
      header: 'Editar Empresa',
      width: '50%',
      height: 'fit-content',
      modal: true,
      data: id ,
      styleClass: 'backdrop-blur-sm !border-0 bg-transparent'
    });

    dialog.onClose
    .subscribe(() => {
      this.obtenerEmpresas();
    })
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
