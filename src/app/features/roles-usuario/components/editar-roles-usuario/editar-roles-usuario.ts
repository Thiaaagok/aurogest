import { Component, inject } from '@angular/core';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { RolUsuarioModel } from '../../models/rol-usuario.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RolesUsuarioService } from '../../services/roles-usuario';
import { permisosDisponibles } from '../../../common/enums/roles.enum';

@Component({
  selector: 'app-editar-roles-usuario',
  imports: [CustomMaterialModule, PrimeNgModule],
  templateUrl: './editar-roles-usuario.html',
  styleUrl: './editar-roles-usuario.scss',
})
export class EditarRolesUsuario {
  rolUsuarioEditar: RolUsuarioModel = new RolUsuarioModel();
  parametro: string;
  cargando: boolean;

  permisosDisponibles = permisosDisponibles;

  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private rolesUsuarioService = inject(RolesUsuarioService);

  ngOnInit() {
    this.parametro = this.config.data;
    this.obtenerRolUsuario();
  }

  obtenerRolUsuario() {
    this.cargando = true;
    this.rolesUsuarioService.obtenerPorId(this.parametro).subscribe({
      next: (response: RolUsuarioModel) => {
        this.cargando = false;
        this.rolUsuarioEditar = response;
      },
      error: (err) => {
        this.cargando = false;
        console.log(err);
      },
      complete: () => {},
    });
  }

  onSubmit() {
    this.cargando = true;
    this.rolesUsuarioService
      .editar(this.rolUsuarioEditar.Id, this.rolUsuarioEditar)
      .subscribe({
        next: (response: RolUsuarioModel) => {
          this.cargando = false;
          this.ref.close();
        },
        error: (err) => {
          this.cargando = false;
          console.log(err);
        },
        complete: () => {},
      });
  }

  eliminarRolUsuarioEditar() {
    this.rolesUsuarioService.eliminar(this.rolUsuarioEditar.Id).subscribe({
      next: (response: boolean) => {
        this.cargando = false;
        this.obtenerRolUsuario();
      },
      error: (err) => {
        this.cargando = false;
        console.log(err);
      },
      complete: () => {},
    });
  }

  reactivarRolUsuarioEditar() {
    this.rolesUsuarioService.reactivar(this.rolUsuarioEditar.Id).subscribe({
      next: (response: boolean) => {
        this.cargando = false;
        this.obtenerRolUsuario();
      },
      error: (err) => {
        this.cargando = false;
        console.log(err);
      },
      complete: () => {},
    });
  }

  cerrar() {
    this.ref.close();
  }
}
