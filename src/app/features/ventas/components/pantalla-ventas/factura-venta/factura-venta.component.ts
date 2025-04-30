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

  listasPrecios = [
    { label: 'General', value: 'general' },
    { label: 'Distribuidor', value: 'distribuidor' }
  ];

  listaPrecioSeleccionada: any;
  
  numeraciones = [
    { label: 'Principal', value: 'principal' },
    { label: 'Alternativa', value: 'alternativa' }
  ];
  
  clientes = [
    { label: 'Consumidor final (222222222222)', value: 'cf' },
    { label: 'Empresa X (20304050607)', value: 'empresa' }
  ];
}
