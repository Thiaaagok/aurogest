import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Table } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { GrillaUtilService } from '../../../common/services/grilla-util.service';
import { TicketsService } from '../../services/tickets.service';
import { TicketModel } from '../../models/ticket.model';
import {
  TICKET_ESTADOS,
  TICKET_PRIORIDADES,
  TICKET_MODULOS,
  severidadEstado,
  severidadPrioridad,
} from '../../models/ticket.enums';
import { NuevoTicketComponent } from '../nuevo/nuevo-ticket.component';
import { DetalleTicketComponent } from '../detalle/detalle-ticket.component';
import { UsuarioModel } from '../../../usuarios/models/usuario.model';
import { UsuariosService } from '../../../usuarios/services/usuarios.service';

@Component({
  selector: 'app-grilla-tickets',
  standalone: true,
  imports: [PrimeNgModule, CommonModule, RouterModule, CustomMaterialModule, FormsModule],
  templateUrl: './grilla-tickets.component.html',
  styleUrl: './grilla-tickets.component.scss',
})
export class GrillaTicketsComponent {
  @ViewChild('filter') filter!: ElementRef;

  tickets: TicketModel[] = [];
  usuariosCombo: UsuarioModel[] = [];
  cargando = false;

  // Filtros
  fechasRango: Date[] = [];
  estadoFiltro: string | null = null;
  prioridadFiltro: string | null = null;
  moduloFiltro: string | null = null;
  usuarioFiltro: UsuarioModel | null = null;

  // Combos
  estadosOpciones    = TICKET_ESTADOS;
  prioridadesOpciones = TICKET_PRIORIDADES;
  modulosOpciones  = TICKET_MODULOS;

  // Helpers de severity (usados en el template)
  severidadEstado    = severidadEstado;
  severidadPrioridad = severidadPrioridad;

  private ticketsService  = inject(TicketsService);
  private usuariosService = inject(UsuariosService);
  private grillaUtil      = inject(GrillaUtilService);
  private dialogService   = inject(DialogService);

  ngOnInit() {
    const hoy = new Date();
    this.fechasRango = [new Date(hoy.getFullYear(), hoy.getMonth(), 1), hoy];
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

    this.cargando = true;
    this.ticketsService.buscar({
      fechaDesde:  desde.toISOString(),
      fechaHasta:  hasta.toISOString(),
      estado:      this.estadoFiltro    ?? undefined,
      prioridad:   this.prioridadFiltro ?? undefined,
      categoria:   this.moduloFiltro ?? undefined,
      usuarioId:   this.usuarioFiltro?.Id ?? undefined,
    }).subscribe({
      next: (res) => { this.tickets = res; this.cargando = false; },
      error: (err) => { console.error(err); this.cargando = false; },
    });
  }

  abrirNuevo() {
    const dialog = this.dialogService.open(NuevoTicketComponent, {
      header: 'Nuevo Ticket',
      width: '55%',
      height: 'fit-content',
      modal: true,
      styleClass: 'backdrop-blur-sm !border-0 bg-transparent',
    });
    dialog.onClose.subscribe((resultado: boolean) => {
      if (resultado) this.buscar();
    });
  }

  abrirDetalle(ticket: TicketModel) {
    const dialog = this.dialogService.open(DetalleTicketComponent, {
      header: `Ticket #${String(ticket.Numero).padStart(5, '0')} — ${ticket.Titulo}`,
      width: '65%',
      height: 'fit-content',
      modal: true,
      focusOnShow: false,
      data: ticket.Id,
      styleClass: 'backdrop-blur-sm !border-0 bg-transparent',
    });
    dialog.onClose.subscribe(() => this.buscar());
  }

  filtrarGrilla(table: Table, event: Event) {
    this.grillaUtil.filtrarGlobal(table, event);
  }

  limpiarFiltros(table: Table) {
    this.grillaUtil.limpiarFiltrado(table, this.filter);
    this.estadoFiltro    = null;
    this.prioridadFiltro = null;
    this.moduloFiltro = null;
    this.usuarioFiltro   = null;
    this.buscar();
  }
}
