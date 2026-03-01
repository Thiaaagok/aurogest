import { Component, inject } from '@angular/core';
import { CustomMaterialModule } from '../../common/material/custom-material.module';
import { PrimeNgModule } from '../../common/material/primeng.module';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { FloatLabel } from 'primeng/floatlabel';
import { RolUsuarioModel } from '../models/rol-usuario.model';
import { GrillaUtilService } from '../../common/services/grilla-util.service';
import { DialogService } from 'primeng/dynamicdialog';
import { RolesUsuarioService } from '../services/roles-usuario';
import { Table } from 'primeng/table';
import { EditarRolesUsuario } from './editar-roles-usuario/editar-roles-usuario';
import { permisosDisponibles } from '../../common/enums/roles.enum';

@Component({
  selector: 'app-roles-usuario',
  imports: [
    CustomMaterialModule,
    PrimeNgModule,
    InputTextModule,
    ToastModule,
    FloatLabel,
  ],
  templateUrl: './roles-usuario.html',
  styleUrl: './roles-usuario.scss',
})
export class RolesUsuario {
  nuevoRolUsuario: RolUsuarioModel = new RolUsuarioModel();
  rolesUsuario: RolUsuarioModel[] = [];
  rolesUsuarioFiltro: RolUsuarioModel[] = [];

  cargando: boolean;
  registrosGrillaActivos: boolean;
  permisosDisponibles = permisosDisponibles;

  private rolesUsuarioService = inject(RolesUsuarioService);
  private GrillaUtilService = inject(GrillaUtilService);
  private dialogService = inject(DialogService);

  constructor() {
    this.registrosGrillaActivos = true;
  }

  ngOnInit() {
    this.obtenerRolesUsuario();
  }

  obtenerRolesUsuario() {
    this.cargando = true;
    this.rolesUsuarioService.obtenerTodos().subscribe({
      next: (response: RolUsuarioModel[]) => {
        this.cargando = false;
        this.rolesUsuarioFiltro = response;
        this.cargarGrilla();
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
    this.rolesUsuarioService.crear(this.nuevoRolUsuario).subscribe({
      next: (response: RolUsuarioModel) => {
        this.cargando = false;
        this.limpiarModel();
        this.obtenerRolesUsuario();
      },
      error: (err) => {
        this.cargando = false;
        console.log(err);
      },
      complete: () => {},
    });
  }

  cargarGrilla() {
    this.rolesUsuario = this.GrillaUtilService.cargarGrilla(
      this.rolesUsuarioFiltro,
      this.registrosGrillaActivos,
    );
  }

  limpiarFiltrado(table: Table) {
    this.GrillaUtilService.limpiarFiltrado(table);
  }

  filtrarRolesUsuario(table: Table, event: Event) {
    this.GrillaUtilService.filtrarGlobal(table, event);
  }

  editar(id: string) {
    const dialog = this.dialogService.open(EditarRolesUsuario, {
      header: 'Editar RolUsuario',
      width: '50%',
      height: 'fit-content',
      modal: true,
      data: id,
      styleClass: 'backdrop-blur-sm !border-0 bg-transparent',
    });

    dialog.onClose.subscribe(() => {
      this.obtenerRolesUsuario();
    });
  }

  limpiarModel() {
    this.nuevoRolUsuario = new RolUsuarioModel();
  }
}
