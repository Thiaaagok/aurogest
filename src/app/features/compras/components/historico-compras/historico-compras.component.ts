import { Component, inject } from '@angular/core';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { FormsModule } from '@angular/forms';
import { CompraModel } from '../../models/compra.model';
import { c } from "../../../../../../node_modules/@angular/cdk/a11y-module.d-7d03e079";
import { UsuarioModel } from '../../../usuarios/models/usuario.model';
import { ProductoModel } from '../../../productos/models/producto.model';
import { UsuariosService } from '../../../usuarios/services/usuarios.service';
import { ProductosService } from '../../../productos/services/producto.service';
import { ComprasService } from '../../services/compras.service';

@Component({
  selector: 'app-historico-compras',
  imports: [
    PrimeNgModule,
    RouterModule,
    FontAwesomeModule,
    CustomMaterialModule,
    FormsModule,
  ],
  templateUrl: './historico-compras.component.html',
  styleUrl: './historico-compras.component.scss',
})
export class HistoricoComprasComponent {

  cargando: boolean;
  fechasRango: Date[] = [];
  Usuario: UsuarioModel;
  Producto: ProductoModel;

  compras: CompraModel[] = [];
  usuariosCombo: UsuarioModel[] = [];
  productosCombo: ProductoModel[] = [];

  private usuariosService = inject(UsuariosService);
  private productosService = inject(ProductosService);
  private comprasService = inject(ComprasService);

  constructor() {
  }

  ngOnInit() {
    this.fechasRango[0] = new Date();
    this.fechasRango[1] = new Date();
    this.cargarUsuariosCombo();
    this.cargarProductosCombo();
    this.obtenerCompras();
  }


  obtenerCompras() {
    if (!this.fechasRango[0] || !this.fechasRango[1]) return;

    const fechaDesdeDate = new Date(this.fechasRango[0]);
    const fechaHastaDate = new Date(this.fechasRango[1]);
    fechaDesdeDate.setHours(0, 0, 0, 0); 
    fechaHastaDate.setHours(23, 59, 59, 999); 
    const fechaDesde = fechaDesdeDate.toISOString();
    const fechaHasta = fechaHastaDate.toISOString();

    this.cargando = true;
    this.comprasService
      .buscarCompras({
        fechaDesde,
        fechaHasta,
        usuarioId: this.Usuario?.Id,
        productoId: this.Producto?.Id,
      })
      .subscribe({
        next: (response: CompraModel[]) => {
          this.compras = response;
          this.cargando = false;
        },
        error: (err) => {
          this.cargando = false;
          console.error('Error al buscar compras', err);
        },
      });
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
