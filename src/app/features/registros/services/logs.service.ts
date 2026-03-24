import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../../common/config/config';
import { LogModel, LogCategoria, LogTipo } from '../models/log.model';

export interface BuscarLogsParams {
  fechaDesde?: string;
  fechaHasta?: string;
  categoria?: LogCategoria;
  tipo?: LogTipo;
  usuarioId?: string;
}

@Injectable({ providedIn: 'root' })
export class LogsService {
  private readonly apiUrl = `${Config.APIURL}/logs`;
  private http = inject(HttpClient);

  buscar(params: BuscarLogsParams): Observable<LogModel[]> {
    let p = new HttpParams();
    if (params.fechaDesde) p = p.set('FechaDesde', params.fechaDesde);
    if (params.fechaHasta) p = p.set('FechaHasta', params.fechaHasta);
    if (params.categoria) p = p.set('Categoria', params.categoria);
    if (params.tipo) p = p.set('Tipo', params.tipo);
    if (params.usuarioId) p = p.set('UsuarioId', params.usuarioId);
    return this.http.get<LogModel[]>(`${this.apiUrl}/buscar`, { params: p });
  }

  obtenerSesiones(): Observable<LogModel[]> {
    return this.http.get<LogModel[]>(`${this.apiUrl}/sesiones`);
  }

  obtenerEventos(): Observable<LogModel[]> {
    return this.http.get<LogModel[]>(`${this.apiUrl}/eventos`);
  }

  obtenerErrores(): Observable<LogModel[]> {
    return this.http.get<LogModel[]>(`${this.apiUrl}/errores`);
  }
}
