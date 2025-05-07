import { Component, inject, ViewChild } from '@angular/core';
import { MuestraProductosComponent } from './muestra-productos/muestra-productos.component';
import { FacturaVentaComponent } from './factura-venta/factura-venta.component';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { UtilitiesService } from '../../../common/services/utilities.services';

@Component({
  selector: 'app-pantalla-ventas',
  imports: [MuestraProductosComponent,FacturaVentaComponent, PrimeNgModule, CustomMaterialModule],
  templateUrl: './pantalla-ventas.component.html',
  styleUrl: './pantalla-ventas.component.scss',
})
export class PantallaVentasComponent {

  private utilitiesService = inject(UtilitiesService);

  ngOnInit(){
    this.utilitiesService.setTituloPagina('Venta');
  }
}
