import { Component, inject } from '@angular/core';
import { VentaModel } from '../../models/venta.model';
import { UsuarioModel } from '../../../usuarios/models/usuario.model';
import { ProductoModel } from '../../../productos/models/producto.model';
import { UsuariosService } from '../../../usuarios/services/usuarios.service';
import { ProductosService } from '../../../productos/services/producto.service';
import { VentasService } from '../../services/ventas';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-historico-ventas',
  imports: [
    PrimeNgModule,
    RouterModule,
    FontAwesomeModule,
    CustomMaterialModule,
    FormsModule,
  ],
  templateUrl: './historico-ventas.html',
  styleUrl: './historico-ventas.scss',
})
export class HistoricoVentas {

  cargando: boolean;
  fechasRango: Date[] = [];
  Usuario: UsuarioModel;
  Producto: ProductoModel;

  ventas: VentaModel[]
  usuariosCombo: UsuarioModel[] = [];
  productosCombo: ProductoModel[] = [];

  private usuariosService = inject(UsuariosService);
  private productosService = inject(ProductosService);
  private ventasService = inject(VentasService);

  constructor() {
  }

  ngOnInit() {
    this.fechasRango[0] = new Date();
    this.fechasRango[1] = new Date();
    this.cargarUsuariosCombo();
    this.cargarProductosCombo();
    this.obtenerVentas();
  }


  obtenerVentas() {
    if (!this.fechasRango[0] || !this.fechasRango[1]) return;

    const fechaDesdeDate = new Date(this.fechasRango[0]);
    const fechaHastaDate = new Date(this.fechasRango[1]);
    fechaDesdeDate.setHours(0, 0, 0, 0);
    fechaHastaDate.setHours(23, 59, 59, 999);
    const fechaDesde = fechaDesdeDate.toISOString();
    const fechaHasta = fechaHastaDate.toISOString();

    this.cargando = true;
    this.ventasService
      .buscarVentas({
        fechaDesde,
        fechaHasta,
        productoId: this.Producto?.Id,
      })
      .subscribe({
        next: (response: VentaModel[]) => {
          this.ventas = response;
          this.cargando = false;
        },
        error: (err) => {
          this.cargando = false;
          console.error('Error al buscar ventas', err);
        },
      });
  }

  buscarUsuarioPorVenta(venta: VentaModel) {
    return this.usuariosCombo.find(usuario => usuario.Id == venta.UsuarioId);
  }

  cargarUsuariosCombo() {
    this.usuariosService.obtenerTodos().subscribe({
      next: (response: UsuarioModel[]) => {
        this.usuariosCombo = response.filter(usuario => usuario.Activo);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => { },
    });
  }

  cargarProductosCombo() {
    this.productosService.obtenerTodos()
      .subscribe({
        next: (response: ProductoModel[]) => {
          this.productosCombo = response.filter(producto => producto.Activo);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => { },
      });
  }
}
