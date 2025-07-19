import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Usuario } from '../../models/usuario.model';
import { Table } from 'primeng/table';
import { UsuariosService } from '../../services/usuarios.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { FormsModule } from '@angular/forms';
import { GrillaUtilService } from '../../../common/services/grilla-util.service';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { NuevoUsuarioComponent } from '../nuevo-usuario/nuevo-usuario.component';
import { DialogService } from 'primeng/dynamicdialog';
import { EditarUsuarioComponent } from '../editar-usuario/editar-usuario.component';


@Component({
  selector: 'app-grilla-usuarios',
  imports: [
    PrimeNgModule,
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    CustomMaterialModule,
    FormsModule
  ],
  templateUrl: './grilla-usuarios.component.html',
  styleUrl: './grilla-usuarios.component.scss',
})
export class GrillaUsuariosComponent {
  @ViewChild('filter') filter!: ElementRef;

  usuarios: Usuario[] = [];
  usuariosFiltro: Usuario[] = [];
  visible: boolean;
  cargando: boolean;
  registrosGrillaActivos: boolean;

  private router = inject(Router);
  private usuariosService = inject(UsuariosService);
  private GrillaUtilService = inject(GrillaUtilService);
  private dialogService = inject(DialogService);

  constructor() {
    this.registrosGrillaActivos = true;
  }

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.cargando = true;
    this.usuariosService.obtenerTodos().subscribe({
      next: (response: Usuario[]) => {
        this.cargando = false;
        this.usuariosFiltro = response;
        this.cargarGrilla();
      },
      error: (err) => {
        this.cargando = false;
        console.log(err);
      },
      complete: () => {},
    });
  }

  cargarGrilla() {
    this.usuarios = this.GrillaUtilService.cargarGrilla(
      this.usuariosFiltro,
      this.registrosGrillaActivos
    );
  }

  limpiarFiltrado(table: Table) {
    this.GrillaUtilService.limpiarFiltrado(table);
  }

  filtrarUsuarios(table: Table, event: Event) {
    this.GrillaUtilService.filtrarGlobal(table, event);
  }


  crearUsuario() {
    const dialog = this.dialogService.open(NuevoUsuarioComponent, {
      header: 'Crear Usuario',
      width: '50%',
      height: 'fit-content',
      modal: true,
      data: {
      },
      styleClass: 'backdrop-blur-sm !border-0 bg-transparent'
    });

    dialog.onClose
    .subscribe(() => {
      this.obtenerUsuarios();
    })
  }

  editarUsuario(id: string) {
    const dialog = this.dialogService.open(EditarUsuarioComponent, {
      header: 'Editar Usuario',
      width: '50%',
      height: 'fit-content',
      modal: true,
      data: id ,
      styleClass: 'backdrop-blur-sm !border-0 bg-transparent'
    });

    dialog.onClose
    .subscribe(() => {
      this.obtenerUsuarios();
    })
  }
}
