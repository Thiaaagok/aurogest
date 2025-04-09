import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { EmpresaModel } from '../../models/empresa.model';
import { EmpresaService } from '../../services/empresa.service';

@Component({
  selector: 'app-nueva-empresa',
  imports: [
    PrimeNgModule,
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    CustomMaterialModule,
    FormsModule,
  ],
  templateUrl: './nueva-empresa.component.html',
  styleUrl: './nueva-empresa.component.scss',
})
export class NuevaEmpresaComponent {
  nuevaEmpresa: EmpresaModel = new EmpresaModel();
  cargando: boolean;

  private router = inject(Router);
  private empresasService = inject(EmpresaService);

  onSubmit() {
    this.cargando = true;
    this.empresasService.crear(this.nuevaEmpresa).subscribe({
      next: (response: EmpresaModel) => {
        this.cargando = false;
        this.limpiarModel();
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {},
    });
  }

  limpiarModel(){
    this.nuevaEmpresa = new EmpresaModel();
  }

  volver() {
    this.router.navigateByUrl('empresas');
  }
}
