import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { FloatLabel } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { TicketsService } from '../../services/tickets.service';
import {
  TicketModel,
  TicketComentarioModel,
  CreateComentarioDto,
} from '../../models/ticket.model';
import {
  TICKET_ESTADOS,
  severidadEstado,
  severidadPrioridad,
} from '../../models/ticket.enums';
import { AuthService } from '../../../auth/services/auth.service';
import { PermisoKey } from '../../../common/enums/roles.enum';

@Component({
  selector: 'app-detalle-ticket',
  standalone: true,
  imports: [
    PrimeNgModule,
    CommonModule,
    CustomMaterialModule,
    FormsModule,
    FloatLabel,
    TextareaModule,
  ],
  templateUrl: './detalle-ticket.component.html',
  styleUrl: './detalle-ticket.component.scss',
})
export class DetalleTicketComponent {
  ticket: TicketModel | null = null;
  comentarios: TicketComentarioModel[] = [];
  nuevoComentario = '';
  cargando = false;
  guardandoComentario = false;
  cambiandoEstado = false;

  estadosOpciones = TICKET_ESTADOS;
  severidadEstado = severidadEstado;
  severidadPrioridad = severidadPrioridad;

  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private ticketsService = inject(TicketsService);
  private authService = inject(AuthService);

  get esAdmin(): boolean {
    return (  
      this.authService.currentUser?.Rol?.Permisos?.includes(
        'cambiar-estado-tickets' as PermisoKey,
      ) ?? false
    );
  }

  ngOnInit() {
    this.cargarTicket();
    console.log(this.esAdmin);
  }

  cargarTicket() {
    const id = this.config.data as string;
    this.cargando = true;
    this.ticketsService.obtenerPorId(id).subscribe({
      next: (res) => {
        this.ticket = res;
        this.comentarios = (res.Comentarios ?? []).reverse();
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
      },
    });
  }

  cambiarEstado(nuevoEstado: string) {
    if (!this.ticket) return;
    this.cambiandoEstado = true;
    this.ticketsService
      .actualizarEstado(this.ticket.Id, { Estado: nuevoEstado as any })
      .subscribe({
        next: (res) => {
          this.ticket = res;
          this.cambiandoEstado = false;
        },
        error: (err) => {
          console.error(err);
          this.cambiandoEstado = false;
        },
      });
  }

  enviarComentario() {
    if (!this.nuevoComentario.trim() || !this.ticket) return;
    const dto: CreateComentarioDto = {
      Contenido: this.nuevoComentario.trim(),
      TicketId: this.ticket.Id,
    };
    this.guardandoComentario = true;
    this.ticketsService.agregarComentario(dto).subscribe({
      next: (comentario) => {
        this.obtenerComentarios();
        this.nuevoComentario = '';
        this.guardandoComentario = false;
      },
      error: (err) => {
        console.error(err);
        this.guardandoComentario = false;
      },
    });
  }

  eliminarComentario(comentario: TicketComentarioModel) {
    this.ticketsService.eliminarComentario(comentario.Id).subscribe({
      next: () => {
        this.comentarios = this.comentarios.filter(
          (c) => c.Id !== comentario.Id,
        );
      },
      error: (err) => console.error(err),
    });
  }

  obtenerComentarios() {
    const id = this.config.data as string;
    this.ticketsService.obtenerComentarios(id).subscribe({
      next: (response) => {
        this.comentarios = response;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  esImagen(nombre: string): boolean {
    return /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(nombre);
  }

  esVideo(nombre: string): boolean {
    return /\.(mp4|webm|mov|avi)$/i.test(nombre);
  }

  archivoUrl(nombre: string): string {
    return `https://localhost:3000/uploads/tickets/${nombre}`;
  }

  previewArchivo: string | null = null;

  abrirPreview(archivo: string) {
    this.previewArchivo = archivo;
  }

  cerrarPreview() {
    this.previewArchivo = null;
  }

  setVolumen(video: HTMLVideoElement) {
    video.volume = 0.5; 
  }

  cerrar() {
    this.ref.close();
  }
}
