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
    TextareaModule
  ],
  templateUrl: './nuevo-usuario.component.html',
  styleUrl: './nuevo-usuario.component.scss',
})
export class NuevoUsuarioComponent {
  nuevoUsuario: UsuarioModel = new UsuarioModel();
  empresasDropdown: EmpresaModel[] = [];
  cargando: boolean;
  visible: boolean;
  mostrarDialog: boolean = true;

  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private usuariosService = inject(UsuariosService);

  ngOnInit() {
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

  cerrar() {
    this.ref.close();
  }

  limpiarModel(){
    this.nuevoUsuario = new UsuarioModel();
  }
}
