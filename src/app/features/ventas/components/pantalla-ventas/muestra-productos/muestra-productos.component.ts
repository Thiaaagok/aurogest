import { Component, ElementRef, HostListener, Input, output, QueryList, ViewChild, ViewChildren } from '@angular/core';
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

  filtroBusqueda = '';

  mostrarAutocomplete = false;
  indiceSeleccionado = 0;
  contadorEnter = 0;

  filtrarProductosOutput = output<string>();
  productoSeleccionadoOutput = output<ProductoModel>();

  onInput() {
    const texto = this.filtroBusqueda?.toLowerCase();

    this.filtrarProductosOutput.emit(this.filtroBusqueda);

    if (!texto) {
      this.mostrarAutocomplete = false;
      return;
    }

    this.indiceSeleccionado = 0;
    this.mostrarAutocomplete = this.productos.length > 0;
  }

  onKeyDown(event: KeyboardEvent) {
    if (!this.mostrarAutocomplete) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.indiceSeleccionado =
          (this.indiceSeleccionado + 1) % this.productos.length;
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.indiceSeleccionado =
          (this.indiceSeleccionado - 1 + this.productos.length) %
          this.productos.length;
        break;

      case 'Enter':
        this.contadorEnter++;
        setTimeout(() => (this.contadorEnter = 0), 350);

        if (this.contadorEnter === 2) {
          this.seleccionarProducto(
            this.productos[this.indiceSeleccionado]
          );
        }
        break;

      case 'Escape':
        this.mostrarAutocomplete = false;
        break;
    }
  }

  seleccionarProducto(producto: ProductoModel) {
    this.mostrarAutocomplete = false;
    this.filtroBusqueda = '';
    this.onInput();
    this.productoSeleccionadoOutput.emit(producto);
  }

  LimpiarFiltrado() {
    this.filtroBusqueda = '';
    this.mostrarAutocomplete = false;
    this.filtrarProductosOutput.emit('');
  }

  productoSeleccionado(producto: ProductoModel) {
    this.productoSeleccionadoOutput.emit(producto);
  }
}
