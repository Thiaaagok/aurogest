import { Component } from '@angular/core';
import { PrimeNgModule } from '../../../../common/material/primeng.module';
import { CustomMaterialModule } from '../../../../common/material/custom-material.module';

@Component({
  selector: 'app-unidad-medida',
  imports: [CustomMaterialModule, PrimeNgModule],
  templateUrl: './unidad-medida.component.html',
  styleUrl: './unidad-medida.component.scss',
})
export class UnidadMedidaComponent { }
