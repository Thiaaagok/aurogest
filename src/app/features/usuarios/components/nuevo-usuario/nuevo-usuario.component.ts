import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { Usuario } from '../../models/usuario.model';
import { FormsModule } from '@angular/forms';
import { EmpresaModel } from '../../../empresas/models/empresa.model';
import { SelectChosenComponent } from '../../../common/components/select-chosen/select-chosen.component';
import { UsuariosService } from '../../services/usuarios.service';
import { EmpresaService } from '../../../empresas/services/empresa.service';

@Component({
  selector: 'app-nuevo-usuario',
  imports: [
    PrimeNgModule,
    CommonModule,
    RouterModule,
    CustomMaterialModule,
    FormsModule,
    SelectChosenComponent,
  ],
  templateUrl: './nuevo-usuario.component.html',
  styleUrl: './nuevo-usuario.component.scss',
})
export class NuevoUsuarioComponent {
  nuevoUsuario: Usuario = new Usuario();
  empresasDropdown: EmpresaModel[] = [];
  cargando: boolean;

  private router = inject(Router);
  private usuariosService = inject(UsuariosService);
  private empresasService = inject(EmpresaService);

  ngOnInit() {
    this.cargarEmpresasDrodpwon();
  }

  onSubmit() {
    this.cargando = true;
    this.usuariosService.crear(this.nuevoUsuario).subscribe({
      next: (response: Usuario) => {
        this.cargando = false;
        this.limpiarModel();
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {},
    });
  }

  volver() {
    this.router.navigateByUrl('usuarios');
  }

  cargarEmpresasDrodpwon() {
    this.empresasService.obtenerTodos()
    .subscribe({
      next: ((response: EmpresaModel[]) => {
        this.cargando = false;
        this.empresasDropdown = response;
      }),
      error: (err) => {
        console.error(err);
      },
      complete: () => {}
    })
  }

  limpiarModel(){
    this.nuevoUsuario = new Usuario();
  }
}
