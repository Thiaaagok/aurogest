import { Component } from '@angular/core';
import { PrimeNgModule } from '../../../../../common/material/primeng.module';
import { CustomMaterialModule } from '../../../../../common/material/custom-material.module';

@Component({
  selector: 'app-editar-unidad-medida',
  imports: [CustomMaterialModule, PrimeNgModule],
  templateUrl: './editar-unidad-medida.component.html',
  styleUrl: './editar-unidad-medida.component.scss',
})
export class EditarUnidadMedidaComponent { }
