import { Component, inject } from '@angular/core';
import { MarcaModel } from '../../models/marca.model';
import { GrillaUtilService } from '../../../common/services/grilla-util.service';
import { Table } from 'primeng/table';
import { MarcasService } from '../../services/marcas.service';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { PrimeNgModule } from '../../../common/material/primeng.module';

@Component({
  selector: 'app-marcas',
  imports: [CustomMaterialModule, PrimeNgModule],
  templateUrl: './marcas.component.html',
  styleUrl: './marcas.component.scss',
})
export class MarcasComponent { 

  nuevaMarca: MarcaModel = new MarcaModel();
  marcas: MarcaModel[] = [];
  marcasFiltro: MarcaModel[] = [];

  cargando: boolean;
  registrosGrillaActivos: boolean;

  private marcasService = inject(MarcasService);
  private GrillaUtilService = inject(GrillaUtilService);

  constructor() {
    this.registrosGrillaActivos = true;
  }

  ngOnInit() {
    this.obtenerMarcas();
  }

  obtenerMarcas() {
    this.cargando = true;
    this.marcasService.obtenerTodos()
      .subscribe({
        next: (response: MarcaModel[]) => {
          this.cargando = false;
          this.marcasFiltro = response;
          this.cargarGrilla();
        },
        error: (err) => {
          this.cargando = false;
          console.log(err);
        },
        complete: () => {},
      });
  }


  cargarGrilla() {
    this.marcas = this.GrillaUtilService.cargarGrilla(
      this.marcasFiltro,
      this.registrosGrillaActivos
    );
  }

  limpiarFiltrado(table: Table) {
    this.GrillaUtilService.limpiarFiltrado(table);
  }

  filtrarMarcas(table: Table, event: Event) {
    this.GrillaUtilService.filtrarGlobal(table, event);
  }

  editarMarca(id:string){}

}
