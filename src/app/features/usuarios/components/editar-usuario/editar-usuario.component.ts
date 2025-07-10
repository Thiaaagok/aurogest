import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { Usuario } from '../../models/usuario.model';
import { UsuariosService } from '../../services/usuarios.service';
import { EmpresaModel } from '../../../empresas/models/empresa.model';
import { SelectChosenComponent } from '../../../common/components/select-chosen/select-chosen.component';
import { timer } from 'rxjs';
import { EmpresaService } from '../../../empresas/services/empresa.service';

@Component({
  selector: 'app-editar-usuario',
  imports: [
    PrimeNgModule,
    CommonModule,
    RouterModule,
    CustomMaterialModule,
    FormsModule,
    SelectChosenComponent,
  ],
  templateUrl: './editar-usuario.component.html',
  styleUrl: './editar-usuario.component.scss',
})
export class EditarUsuarioComponent {
  usuarioEditar: Usuario = new Usuario();
  empresasDropdown: EmpresaModel[] = [];
  parametro: string;
  cargando: boolean;

  private activatedRoute = inject(ActivatedRoute);
  private usuarioService = inject(UsuariosService);
  private router = inject(Router);
  private empresasService = inject(EmpresaService);

  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      this.parametro = params['id'];
      this.obtenerUsuario();
    });
  }

  ngOnInit() {
    this.cargarEmpresasDrodpwon();
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

  volver(){
    this.router.navigateByUrl('usuarios');
  }

  onSubmit(){
    this.cargando = true;
    this.usuarioService.editar(this.usuarioEditar.Id, this.usuarioEditar)
    .subscribe({
      next: ((response: Usuario) => {
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

  eliminarUsuario(){
    this.usuarioService.eliminar(this.usuarioEditar.Id)
    .subscribe({
      next: ((response: boolean) => {
        this.cargando = false;
        timer(300).subscribe(() => {
          this.obtenerUsuario();
        });
      }),
      error: (err) => {
        this.cargando = false;
        console.log(err);
      },
      complete: () => {}
    })
  }

  reactivarUsuario(){
    this.usuarioService.reactivar(this.usuarioEditar.Id)
    .subscribe({
      next: ((response: boolean) => {
        this.cargando = false;
        timer(300).subscribe(() => {
          this.obtenerUsuario();
        });
      }),
      error: (err) => {
        this.cargando = false;
        console.log(err);
      },
      complete: () => {}
    })
  }

  cargarEmpresasDrodpwon() {
    this.empresasService.obtenerTodos()
    .subscribe({
      next: ((response: EmpresaModel[]) => {
        this.cargando = false;
        this.empresasDropdown = response;
      }),
      error: (err) => {
        this.cargando = false;
        console.error(err);
      },
      complete: () => {}
    })
  }
}
