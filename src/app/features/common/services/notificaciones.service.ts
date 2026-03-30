import { inject, Injectable } from "@angular/core";
import { Config } from "../config/config";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Notificacion } from "../models/notificacion.model";

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  private readonly apiUrl = `${Config.APIURL}/notificaciones`;

  http = inject(HttpClient);

  obtenerTodas(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(this.apiUrl);
  }

  obtenerNoLeidas(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.apiUrl}/no-leidas`);
  }

  contarNoLeidas(): Observable<{ cantidad: number }> {
    return this.http.get<{ cantidad: number }>(`${this.apiUrl}/contador`);
  }

  marcarLeida(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/leer`, {});
  }

  marcarTodasLeidas(): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/leer-todas`, {});
  }
}