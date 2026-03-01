import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { UsuarioModel } from '../../models/usuario.model';
import { EmpresaModel } from '../../../empresas/models/empresa.model';
import { UsuariosService } from '../../services/usuarios.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { FloatLabel } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { RolUsuarioModel } from '../../../roles-usuario/models/rol-usuario.model';
import { RolesUsuarioService } from '../../../roles-usuario/services/roles-usuario';

@Component({
  selector: 'app-nuevo-usuario',
  imports: [
    PrimeNgModule,
    CommonModule,
    RouterModule,
    CustomMaterialModule,
    FormsModule,
    InputTextModule,
    ToastModule,
    FloatLabel,
    TextareaModule,
  ],
  templateUrl: './nuevo-usuario.component.html',
  styleUrl: './nuevo-usuario.component.scss',
})
export class NuevoUsuarioComponent {
  nuevoUsuario: UsuarioModel = new UsuarioModel();
  rolesDisponibles: RolUsuarioModel[] = [];
  cargando: boolean;
  visible: boolean;
  mostrarDialog: boolean = true;

  private ref = inject(DynamicDialogRef);
  private usuariosService = inject(UsuariosService);
  private rolesService = inject(RolesUsuarioService);

  ngOnInit() {
    this.cargarRoles();
  }

  onSubmit() {
    this.cargando = true;
    this.usuariosService.crear(this.nuevoUsuario).subscribe({
      next: (response: UsuarioModel) => {
        this.cargando = false;
        this.limpiarModel();
        this.ref.close();
      },
      error: (err) => {
        this.cargando = false;
        console.log(err);
      },
      complete: () => {},
    });
  }

  cargarRoles() {
    this.rolesService.obtenerTodos().subscribe((roles) => {
      this.rolesDisponibles = roles.filter((r) => r.Activo);
    });
  }

  cerrar() {
    this.ref.close();
  }

  limpiarModel() {
    this.nuevoUsuario = new UsuarioModel();
  }
}
