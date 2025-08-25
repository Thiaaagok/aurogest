import { Component } from '@angular/core';
import { PrimeNgModule } from '../../../../common/material/primeng.module';
import { CustomMaterialModule } from '../../../../common/material/custom-material.module';
import { GrillaProductosSeleccionadosComponent } from "./grilla-productos-seleccionados/grilla-productos-seleccionados.component";

@Component({
  selector: 'app-factura-venta',
  imports: [PrimeNgModule, CustomMaterialModule, GrillaProductosSeleccionadosComponent],
  templateUrl: './factura-venta.component.html',
  styleUrl: './factura-venta.component.scss',
})
export class FacturaVentaComponent { 

}
