import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { CommonModule } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import { GrillaUtilService } from '../../../common/services/grilla-util.service';
import { Table } from 'primeng/table';
import { DepositoModel, ProductoStock } from '../../../productos/models/producto.model';
import { StockService } from '../../services/stock.service';
import { UnidadMedidaModel } from '../../../productos/models/unidad-medida.model';
import { SelectChosenComponent } from '../../../common/components/select-chosen/select-chosen.component';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-stock',
  imports: [PrimeNgModule, CustomMaterialModule, CommonModule, SelectChosenComponent, DatePickerModule
  ],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss',
})
export class StockComponent {

  @ViewChild('filter') filter!: ElementRef;
  productos: ProductoStock[] = [];
  productosFiltro: ProductoStock[] = [];
  unidadMedida: string;
  unidadesMedidaCombo: UnidadMedidaModel[] = [];
  depositosCombo: DepositoModel[] = [];
  deposito: DepositoModel;

  cargando: boolean;
  registrosGrillaActivos: boolean;

  private stockService = inject(StockService);
  private dialogService = inject(DialogService);
  private GrillaUtilService = inject(GrillaUtilService);

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

  cargarUnidadesMedidasCombo() {

  }

  limpiarFiltrado(table: Table) {
    this.GrillaUtilService.limpiarFiltrado(table);
  }

  filtrarProductos(table: Table, event: Event) {
    this.GrillaUtilService.filtrarGlobal(table, event);
  }

  bajoStockUmbral: number = 5;

  filtrarBajoStock(table: Table) {
    table.filter((producto: ProductoStock) => producto.StockActual <= this.bajoStockUmbral, 'Cantidad', 'custom');
  }

  filtrarSinStock(table: Table) {
    table.filter((producto: ProductoStock) => producto.StockActual === 0, 'Cantidad', 'custom');
  }

}
