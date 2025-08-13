import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { Usuario } from '../../models/usuario.model';
import { UsuariosService } from '../../services/usuarios.service';
import { EmpresaModel } from '../../../empresas/models/empresa.model';
import { EmpresaService } from '../../../empresas/services/empresa.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { FloatLabel } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-editar-usuario',
  imports: [
    PrimeNgModule,
    CommonModule,
    RouterModule,
    CustomMaterialModule,
    FormsModule,
    InputTextModule,
    ToastModule,
    FloatLabel,
    TextareaModule
  ],
  templateUrl: './editar-usuario.component.html',
  styleUrl: './editar-usuario.component.scss',
})
export class EditarUsuarioComponent {
  usuarioEditar: Usuario = new Usuario();
  empresasDropdown: EmpresaModel[] = [];
  parametro: string;
  cargando: boolean;

  private usuarioService = inject(UsuariosService);
  private empresasService = inject(EmpresaService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);


  ngOnInit() {
    this.parametro = this.config.data;
    this.obtenerUsuario();
  }

  obtenerUsuario() {
    this.cargando = true;
    this.usuarioService.obtenerPorId(this.parametro).subscribe({
      next: (response: Usuario) => {
        this.cargando = false;
        this.usuarioEditar = response;
        console.log(response)
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

  onSubmit(){
    this.cargando = true;
    this.usuarioService.editar(this.usuarioEditar.Id, this.usuarioEditar)
    .subscribe({
      next: ((response: Usuario) => {
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

  eliminarUsuario(){
    this.cargando = true;
    this.usuarioService.eliminar(this.usuarioEditar.Id)
    .subscribe({
      next: ((response: boolean) => {
        this.cargando = false;
        this.obtenerUsuario();
      }),
      error: (err) => {
        this.cargando = false;
        console.log(err);
      },
      complete: () => {}
    })
  }

  reactivarUsuario(){
    this.cargando = true;
    this.usuarioService.reactivar(this.usuarioEditar.Id)
    .subscribe({
      next: ((response: boolean) => {
        this.cargando = false;
        this.obtenerUsuario();
      }),
      error: (err) => {
        this.cargando = false;
        console.log(err);
      },
      complete: () => {}
    })
  }

}
