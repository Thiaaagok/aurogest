import { Component, inject } from '@angular/core';
import { CustomMaterialModule } from '../../../../common/material/custom-material.module';
import { CommonModule } from '@angular/common';
import { ProductoModel } from '../../../../productos/models/producto.model';
import { PrimeNgModule } from '../../../../common/material/primeng.module';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-producto-seleccionado',
  imports: [CustomMaterialModule, CommonModule, PrimeNgModule],
  templateUrl: './producto-seleccionado.html',
  styleUrl: './producto-seleccionado.scss',
})
export class ProductoSeleccionado {

  productoSeleccionado: ProductoModel = new ProductoModel();
  subtotal: number = 0;
  cantidad: number = 1;


  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  constructor() {
    this.productoSeleccionado = this.config.data;
  }

  ngOnInit() {
    this.subtotal = +(
      this.productoSeleccionado.PrecioVenta * this.cantidad
    ).toFixed(2);
  }

  disminuirCantidad(event: MouseEvent) {
    event.stopPropagation();
    if (this.cantidad) {
      this.cantidad--;
      this.subtotal = +(
        this.productoSeleccionado.PrecioVenta * this.cantidad
      ).toFixed(2);
    }
  }

  aumentarCantidad(event: MouseEvent) {
    event.stopPropagation();
    this.cantidad++;
    this.subtotal = +(
      this.productoSeleccionado.PrecioVenta * this.cantidad
    ).toFixed(2);
  }

  cambiarCantidad(valor: number) {
    if (valor < 0 || valor == null) {
      this.cantidad = 0;
    }
    this.subtotal = +(
      this.productoSeleccionado.PrecioVenta * this.cantidad
    ).toFixed(2);
  }

  aceptar() {
    this.ref.close({
      producto: this.productoSeleccionado,
      cantidad: this.cantidad,
      subtotal: this.subtotal
    });
  }

  cancelar() {
    this.ref.close();
  }

}
