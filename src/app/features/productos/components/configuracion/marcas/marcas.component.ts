import { Component, inject } from '@angular/core';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { CustomMaterialModule } from '../../../../common/material/custom-material.module';
import { PrimeNgModule } from '../../../../common/material/primeng.module';
import { MarcaModel } from '../../../models/marca.model';
import { MarcasService } from '../../../services/marcas.service';
import { GrillaUtilService } from '../../../../common/services/grilla-util.service';
import { Table } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { EditarMarcasComponent } from './editar-marcas/editar-marcas.component';

@Component({
  selector: 'app-marcas',
  imports: [CustomMaterialModule, PrimeNgModule,
    InputTextModule,
    ToastModule,
    FloatLabel,],
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
  private dialogService = inject(DialogService);

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
        complete: () => { },
      });
  }

  onSubmit() {
    this.cargando = true;
    this.marcasService.crear(this.nuevaMarca)
      .subscribe({
        next: (response: MarcaModel) => {
          this.cargando = false;
          this.limpiarModel();
          this.obtenerMarcas();
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => { },
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

  editar(id: string) {
    const dialog = this.dialogService.open(EditarMarcasComponent, {
      header: 'Editar Marca',
      width: '50%',
      height: 'fit-content',
      modal: true,
      data: id,
      styleClass: 'backdrop-blur-sm !border-0 bg-transparent'
    });

    dialog.onClose
      .subscribe(() => {
        this.obtenerMarcas();
      })
  }

  limpiarModel() {
    this.nuevaMarca = new MarcaModel();
  }
}
