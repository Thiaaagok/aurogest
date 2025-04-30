import { Component, inject } from '@angular/core';
import { ProductoModel } from '../../../../../productos/models/producto.model';
import { VentasSignalService } from '../../../../services/ventas-signals.service';
import { PrimeNgModule } from '../../../../../common/material/primeng.module';

@Component({
  selector: 'app-grilla-productos-seleccionados',
  imports: [
    PrimeNgModule
  ],
  templateUrl: './grilla-productos-seleccionados.component.html',
  styleUrl: './grilla-productos-seleccionados.component.scss',
})
export class GrillaProductosSeleccionadosComponent { 

  productosSeleccionados: any[] = [];

  private ventasSignals = inject(VentasSignalService);

  ngOnInit(){
    /* this.productosSeleccionados = this.ventasSignals.grillaProductosSeleccionados(); */
    this.productosSeleccionados = [
      {
        Descripcion: 'Aceite sintético 5W-30',
        Cantidad: 2,
        Total: 1000
      },
      {
        Descripcion: 'Filtro de aire',
        Cantidad: 1,
        Total: 500
      },
      {
        Descripcion: 'Limpieza de inyectores',
        Cantidad: 1,
        Total: 1500
      },
      {
        Descripcion: 'Aceite sintético 5W-30',
        Cantidad: 2,
        Total: 1000
      },
      {
        Descripcion: 'Filtro de aire',
        Cantidad: 1,
        Total: 500
      },
      {
        Descripcion: 'Limpieza de inyectores',
        Cantidad: 1,
        Total: 1500
      },
      {
        Descripcion: 'Aceite sintético 5W-30',
        Cantidad: 2,
        Total: 1000
      },
      {
        Descripcion: 'Filtro de aire',
        Cantidad: 1,
        Total: 500
      },
      {
        Descripcion: 'Limpieza de inyectores',
        Cantidad: 1,
        Total: 1500
      },
      {
        Descripcion: 'Aceite sintético 5W-30',
        Cantidad: 2,
        Total: 1000
      },
      {
        Descripcion: 'Filtro de aire',
        Cantidad: 1,
        Total: 500
      },
      {
        Descripcion: 'Limpieza de inyectores',
        Cantidad: 1,
        Total: 1500
      },
      {
        Descripcion: 'Aceite sintético 5W-30',
        Cantidad: 2,
        Total: 1000
      },
      {
        Descripcion: 'Filtro de aire',
        Cantidad: 1,
        Total: 500
      },
      {
        Descripcion: 'Limpieza de inyectores',
        Cantidad: 1,
        Total: 1500
      },
      {
        Descripcion: 'Aceite sintético 5W-30',
        Cantidad: 2,
        Total: 1000
      },
      {
        Descripcion: 'Filtro de aire',
        Cantidad: 1,
        Total: 500
      },
      {
        Descripcion: 'Limpieza de inyectores',
        Cantidad: 1,
        Total: 1500
      }
    ];
  }
}
