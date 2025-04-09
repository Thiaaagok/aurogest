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


@Component({
  selector: 'app-grilla-usuarios',
  imports: [
    PrimeNgModule,
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    CustomMaterialModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './grilla-usuarios.component.html',
  styleUrl: './grilla-usuarios.component.scss',
})
export class GrillaUsuariosComponent {
  @ViewChild('filter') filter!: ElementRef;

  usuarios: Usuario[] = [];
  usuariosFiltro: Usuario[] = [];

  cargando: boolean;
  registrosGrillaActivos: boolean;

  private router = inject(Router);
  private usuariosService = inject(UsuariosService);
  private GrillaUtilService = inject(GrillaUtilService);

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

  crearUsuario() {
    this.router.navigateByUrl(`usuarios/nuevo`);
  }

  editarUsuario(id: string) {
    this.router.navigateByUrl(`usuarios/editar/${id}`);
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
}
