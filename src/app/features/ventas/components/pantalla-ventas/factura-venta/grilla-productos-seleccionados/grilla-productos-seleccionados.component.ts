import { Component } from '@angular/core';
import { PrimeNgModule } from '../../../../../common/material/primeng.module';
import { VentaItem } from '../../../../models/venta.model';

@Component({
  selector: 'app-grilla-productos-seleccionados',
  imports: [
    PrimeNgModule
  ],
  templateUrl: './grilla-productos-seleccionados.component.html',
  styleUrl: './grilla-productos-seleccionados.component.scss',
})
export class GrillaProductosSeleccionadosComponent { 

  ventas: VentaItem[];

}
