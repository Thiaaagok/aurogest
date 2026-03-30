import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../../common/config/config';
import {
  TicketModel,
  CreateTicketDto,
  CreateComentarioDto,
  UpdateTicketEstadoDto,
  TicketComentarioModel,
} from '../models/ticket.model';

@Injectable({ providedIn: 'root' })
export class TicketsService {
  private readonly apiUrl = `${Config.APIURL}/tickets`;
  private http = inject(HttpClient);

  obtenerTodos(): Observable<TicketModel[]> {
    return this.http.get<TicketModel[]>(this.apiUrl);
  }

  obtenerPorId(id: string): Observable<TicketModel> {
    return this.http.get<TicketModel>(`${this.apiUrl}/${id}`);
  }

  buscar(params: {
    fechaDesde?: string;
    fechaHasta?: string;
    estado?: string;
    prioridad?: string;
    categoria?: string;
    usuarioId?: string;
  }): Observable<TicketModel[]> {
    let httpParams = new HttpParams();
    if (params.fechaDesde)  httpParams = httpParams.set('fechaDesde', params.fechaDesde);
    if (params.fechaHasta)  httpParams = httpParams.set('fechaHasta', params.fechaHasta);
    if (params.estado)      httpParams = httpParams.set('estado', params.estado);
    if (params.prioridad)   httpParams = httpParams.set('prioridad', params.prioridad);
    if (params.categoria)   httpParams = httpParams.set('categoria', params.categoria);
    if (params.usuarioId)   httpParams = httpParams.set('usuarioId', params.usuarioId);
    return this.http.get<TicketModel[]>(`${this.apiUrl}/buscar`, { params: httpParams });
  }

  crear(dto: CreateTicketDto): Observable<TicketModel> {
    return this.http.post<TicketModel>(this.apiUrl, dto);
  }

  actualizarEstado(id: string, dto: UpdateTicketEstadoDto): Observable<TicketModel> {
    return this.http.patch<TicketModel>(`${this.apiUrl}/${id}/estado`, dto);
  }

  eliminar(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }

  // ── Comentarios ───────────────────────────────────────────────────────────

  agregarComentario(dto: CreateComentarioDto): Observable<TicketComentarioModel> {
    return this.http.post<TicketComentarioModel>(`${this.apiUrl}/comentarios`, dto);
  }

  obtenerComentarios(ticketId: string): Observable<TicketComentarioModel[]> {
    return this.http.get<TicketComentarioModel[]>(`${this.apiUrl}/${ticketId}/comentarios`);
  }

  eliminarComentario(comentarioId: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/comentarios/${comentarioId}`);
  }
}
