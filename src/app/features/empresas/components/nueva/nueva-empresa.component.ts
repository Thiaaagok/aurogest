import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { EmpresaModel } from '../../models/empresa.model';
import { EmpresaService } from '../../services/empresa.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { FloatLabel } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-nueva-empresa',
  imports: [
    PrimeNgModule,
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    CustomMaterialModule,
    FormsModule,   
    InputTextModule,
    ToastModule,
    FloatLabel,
    TextareaModule
  ],
  templateUrl: './nueva-empresa.component.html',
  styleUrl: './nueva-empresa.component.scss',
})
export class NuevaEmpresaComponent {
  nuevaEmpresa: EmpresaModel = new EmpresaModel();
  cargando: boolean;

  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private empresasService = inject(EmpresaService);

  onSubmit() {
    this.cargando = true;
    this.empresasService.crear(this.nuevaEmpresa).subscribe({
      next: (response: EmpresaModel) => {
        this.cargando = false;
        this.limpiarModel();
      },
      error: (err) => {
        this.cargando = false;
        console.log(err);
      },
      complete: () => {},
    });
  }

  limpiarModel(){
    this.nuevaEmpresa = new EmpresaModel();
  }

  cerrar() {
    this.ref.close();
  }
}
