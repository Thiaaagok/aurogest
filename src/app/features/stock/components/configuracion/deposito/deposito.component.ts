import { Component, inject } from '@angular/core';
import { PrimeNgModule } from '../../../../common/material/primeng.module';
import { CustomMaterialModule } from '../../../../common/material/custom-material.module';
import { DepositoModel } from '../../../../productos/models/producto.model';
import { GrillaUtilService } from '../../../../common/services/grilla-util.service';
import { DepositoService } from '../../../services/deposito.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-deposito',
  imports: [CustomMaterialModule, PrimeNgModule],
  templateUrl: './deposito.component.html',
  styleUrl: './deposito.component.scss',
})
export class DepositoComponent {
  nuevoDeposito: DepositoModel = new DepositoModel();
  depositos: DepositoModel[] = [];
  depositosFiltro: DepositoModel[] = [];

  cargando: boolean;
  registrosGrillaActivos: boolean;

  private depositoService = inject(DepositoService);
  private GrillaUtilService = inject(GrillaUtilService);


  constructor() {
    this.registrosGrillaActivos = true;
  }

  ngOnInit() {
    this.obtenerDepositos();
  }

  obtenerDepositos() {
    this.cargando = true;
    this.depositoService.obtenerTodos()
      .subscribe({
        next: (response: DepositoModel[]) => {
          this.cargando = false;
          this.depositosFiltro = response;
          this.cargarGrilla();
        },
        error: (err) => {
          this.cargando = false;
          console.log(err);
        },
        complete: () => { },
      });
  }

  onSubmit() {
    this.cargando = true;
    this.depositoService.crear(this.nuevoDeposito)
      .subscribe({
        next: (response: DepositoModel) => {
          this.cargando = false;
          this.limpiarModel();
          this.obtenerDepositos();
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => { },
      });
  }


  cargarGrilla() {
    this.depositos = this.GrillaUtilService.cargarGrilla(
      this.depositosFiltro,
      this.registrosGrillaActivos
    );
  }

  limpiarFiltrado(table: Table) {
    this.GrillaUtilService.limpiarFiltrado(table);
  }

  filtrarCategorias(table: Table, event: Event) {
    this.GrillaUtilService.filtrarGlobal(table, event);
  }

  editar(id: string) { }

  limpiarModel() {
    this.nuevoDeposito = new DepositoModel();
  }
}
