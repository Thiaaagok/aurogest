import { Component } from '@angular/core';
import { MuestraProductosComponent } from './muestra-productos/muestra-productos.component';
import { FacturaVentaComponent } from './factura-venta/factura-venta.component';

@Component({
  selector: 'app-pantalla-ventas',
  imports: [MuestraProductosComponent,FacturaVentaComponent],
  templateUrl: './pantalla-ventas.component.html',
  styleUrl: './pantalla-ventas.component.scss',
})
export class PantallaVentasComponent { }
