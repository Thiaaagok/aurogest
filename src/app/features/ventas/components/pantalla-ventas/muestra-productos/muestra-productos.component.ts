import { Component, Input, output } from '@angular/core';
import { ProductoModel } from '../../../../productos/models/producto.model';
import { PrimeNgModule } from '../../../../common/material/primeng.module';
import { CustomMaterialModule } from '../../../../common/material/custom-material.module';

@Component({
  selector: 'app-muestra-productos',
  imports: [PrimeNgModule, CustomMaterialModule],
  templateUrl: './muestra-productos.component.html',
  styleUrl: './muestra-productos.component.scss',
})
export class MuestraProductosComponent {
  @Input() productos: ProductoModel[] = [];
  filtroBusqueda: string;
  filtrarProductosOutput = output<string>();

  filtrarProductos() {
    this.filtrarProductosOutput.emit(this.filtroBusqueda);
  }

  LimpiarFiltrado() {
    this.filtroBusqueda = '';
    this.filtrarProductosOutput.emit(this.filtroBusqueda);
  }
}
