// remito-venta/remito-venta.component.ts
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RemitosService } from '../../services/remitos.service';
import { UsuarioModel } from '../../../usuarios/models/usuario.model';
import { VentaModel } from '../../../ventas/models/venta.model';
import { UsuariosService } from '../../../usuarios/services/usuarios.service';
import { VentasService } from '../../../ventas/services/ventas';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { Remito } from '../../models/remito.model';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';

@Component({
  selector: 'app-remito-venta',
  standalone: true,
  imports: [CustomMaterialModule, ReactiveFormsModule, PrimeNgModule],
  templateUrl: 'remito.component.html',
  styleUrl: 'remito.component.scss',
})
export class RemitoVentaComponent {
  cargando: boolean;
  fechasRango: Date[] = [];
  Usuario: UsuarioModel;
  Venta: VentaModel;

  remitos: Remito[] = [];
  usuariosCombo: UsuarioModel[] = [];
  ventasCombo: VentaModel[] = [];

  private usuariosService = inject(UsuariosService);
  private ventasService = inject(VentasService);
  private remitosService = inject(RemitosService);

  constructor() {}

  ngOnInit() {
    this.fechasRango[0] = new Date();
    this.fechasRango[1] = new Date();
    this.cargarUsuariosCombo();
    this.obtenerVentas();
    this.obtenerRemitos();
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
      })
      .subscribe({
        next: (response: VentaModel[]) => {
          this.ventasCombo = response;
          this.cargando = false;
        },
        error: (err) => {
          this.cargando = false;
          console.error('Error al buscar ventas', err);
        },
      });
  }

  /* buscarRemitoPorVenta(venta: VentaModel) {
    return this.remitos.find(usuario => usuario.Id == venta.UsuarioId);
  } */

  cargarUsuariosCombo() {
    this.usuariosService.obtenerTodos().subscribe({
      next: (response: UsuarioModel[]) => {
        this.usuariosCombo = response.filter((usuario) => usuario.Activo);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {},
    });
  }

  obtenerRemitos() {
    if (!this.fechasRango[0] || !this.fechasRango[1]) return;

    const fechaDesdeDate = new Date(this.fechasRango[0]);
    const fechaHastaDate = new Date(this.fechasRango[1]);
    fechaDesdeDate.setHours(0, 0, 0, 0);
    fechaHastaDate.setHours(23, 59, 59, 999);
    const fechaDesde = fechaDesdeDate.toISOString();
    const fechaHasta = fechaHastaDate.toISOString();

    this.cargando = true;
    this.remitosService
      .obtenerRemitosPorFecha({
        fechaDesde,
        fechaHasta,
      })
      .subscribe({
        next: (response: Remito[]) => {
          this.remitos = response;
          this.cargando = false;
        },
        error: (err) => {
          this.cargando = false;
          console.error('Error al buscar remitos', err);
        },
      });
  }
}
