import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { CommonModule } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import { GrillaUtilService } from '../../../common/services/grilla-util.service';
import { Table } from 'primeng/table';
import { StockService } from '../../services/stock.service';
import { DatePickerModule } from 'primeng/datepicker';
import { ProductoStock } from '../../models/producto-stock.model';
import { FacturaService } from '../../../common/services/factura.service';
import qz from 'qz-tray';

@Component({
  selector: 'app-stock',
  imports: [PrimeNgModule, CustomMaterialModule, CommonModule, DatePickerModule
  ],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss',
})
export class StockComponent {

  @ViewChild('filter') filter!: ElementRef;
  productos: ProductoStock[] = [];
  productosFiltro: ProductoStock[] = [];

  cargando: boolean;
  registrosGrillaActivos: boolean;

  private stockService = inject(StockService);
  private dialogService = inject(DialogService);
  private GrillaUtilService = inject(GrillaUtilService);
  private facturaService = inject(FacturaService);

  constructor() {
    this.registrosGrillaActivos = true;
  }

  ngOnInit() {
    this.obtenerProductos();
  }

  obtenerProductos() {
    this.cargando = true;
    this.stockService.obtenerTodos().subscribe({
      next: (response: ProductoStock[]) => {
        this.cargando = false;
        this.productosFiltro = response;
        this.cargarGrilla();
      },
      error: (err) => {
        this.cargando = false;
        console.log(err);
      },
      complete: () => { },
    });
  }

  cargarGrilla() {
    this.productos = this.GrillaUtilService.cargarGrilla(
      this.productosFiltro,
      this.registrosGrillaActivos
    );
  }

  limpiarFiltrado(table: Table) {
    this.GrillaUtilService.limpiarFiltrado(table);
  }

  filtrarProductos(table: Table, event: Event) {
    this.GrillaUtilService.filtrarGlobal(table, event);
  }

  bajoStockUmbral: number = 5;

  filtrarBajoStock() {
    this.productos.sort((a, b) => {
      const aBajo = a.StockActual < a.StockMinimo ? 0 : 1;
      const bBajo = b.StockActual < b.StockMinimo ? 0 : 1;
      return aBajo - bBajo; // primero los con bajo stock
    });

  }

  filtrarSinStock() {
    this.productos.sort((a, b) => {
      const aSin = a.StockActual === 0 ? 0 : 1;
      const bSin = b.StockActual === 0 ? 0 : 1;
      return aSin - bSin;
    });
  }

  crearFactura() {
    const datosFactura = {
      fecha: "2025-08-06",
      cliente: "Juan Pérez",
      items: [
        { nombre: "Coca-Cola 500ml", cantidad: 2, precio: 350 },
        { nombre: "Hamburguesa Clásica", cantidad: 1, precio: 1200 },
        { nombre: "Papas Fritas", cantidad: 1, precio: 800 }
      ],
      total: 2700
    };

    this.facturaService.generar(datosFactura).subscribe({
      next: (resp: any) => {
        alert(resp.mensaje || 'Factura impresa');
      },
      error: err => {
        alert('Error al imprimir factura');
        console.error(err);
      }
    });
  }
}
