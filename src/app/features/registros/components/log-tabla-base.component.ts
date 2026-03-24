import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomMaterialModule } from '../../common/material/custom-material.module';
import { PrimeNgModule } from '../../common/material/primeng.module';
import { LogCategoria, LogModel, LogTipo, severidadLog } from '../models/log.model';
import { UsuarioModel } from '../../usuarios/models/usuario.model';
import { BuscarLogsParams, LogsService } from '../services/logs.service';
import { UsuariosService } from '../../usuarios/services/usuarios.service';

@Component({
  selector: 'app-log-tabla-base',
  imports: [CustomMaterialModule, CommonModule, PrimeNgModule, FormsModule],
  templateUrl: './log-tabla-base.component.html',
  styleUrl:    './log-tabla-base.component.scss',
})
export class LogTablaBaseComponent implements OnInit {
  @Input() categoria!: LogCategoria;
  @Input() tiposOpciones: { label: string; value: string }[] = [];
  @Input() tituloSeccion = 'Logs';

  logs: LogModel[] = [];
  usuariosCombo: UsuarioModel[] = [];
  cargando = false;

  fechasRango: Date[] = [];
  tipoFiltro: string | null = null;
  usuarioFiltro: UsuarioModel | null = null;

  severidadLog = severidadLog;

  private logsService     = inject(LogsService);
  private usuariosService = inject(UsuariosService);

  ngOnInit() {
    const hoy = new Date();
    this.fechasRango = [
      new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()),
      hoy,
    ];
    this.cargarUsuarios();
    this.buscar();
  }

  cargarUsuarios() {
    this.usuariosService.obtenerTodos().subscribe({
      next: (res) => { this.usuariosCombo = res.filter(u => u.Activo); },
      error: (err) => console.error(err),
    });
  }

  buscar() {
    if (!this.fechasRango[0] || !this.fechasRango[1]) return;

    const desde = new Date(this.fechasRango[0]);
    const hasta = new Date(this.fechasRango[1]);
    desde.setHours(0, 0, 0, 0);
    hasta.setHours(23, 59, 59, 999);

    const params: BuscarLogsParams = {
      fechaDesde: desde.toISOString(),
      fechaHasta: hasta.toISOString(),
      categoria:  this.categoria,
    };
    if (this.tipoFiltro)        params.tipo      = this.tipoFiltro as LogTipo;
    if (this.usuarioFiltro?.Id) params.usuarioId = this.usuarioFiltro.Id;

    this.cargando = true;
    this.logsService.buscar(params).subscribe({
      next:  (res) => { this.logs = res; this.cargando = false; },
      error: (err) => { console.error(err); this.cargando = false; },
    });
  }

  limpiar() {
    const hoy = new Date();
    this.fechasRango   = [new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()), hoy];
    this.tipoFiltro    = null;
    this.usuarioFiltro = null;
    this.buscar();
  }
}
