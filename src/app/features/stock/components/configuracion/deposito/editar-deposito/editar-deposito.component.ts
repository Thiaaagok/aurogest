import { Component } from '@angular/core';
import { PrimeNgModule } from '../../../../../common/material/primeng.module';
import { CustomMaterialModule } from '../../../../../common/material/custom-material.module';

@Component({
  selector: 'app-editar-deposito',
  imports: [CustomMaterialModule, PrimeNgModule],
  templateUrl: './editar-deposito.component.html',
  styleUrl: './editar-deposito.component.scss',
})
export class EditarDepositoComponent { }
