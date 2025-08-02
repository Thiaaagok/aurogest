import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Config } from '../../common/config/config';
import { Observable } from 'rxjs';
import { ProductoStock } from '../models/producto-stock.model';

@Injectable({ providedIn: 'root' })
export class StockService {

  private readonly apiUrl = `${Config.APIURL}/stock`;

  private http = inject(HttpClient)

  obtenerTodos(): Observable<ProductoStock[]> {
    return this.http.get<ProductoStock[]>(`${this.apiUrl}`);
  }

  obtenerPorId(id: string): Observable<ProductoStock> {
    return this.http.get<ProductoStock>(`${this.apiUrl}/${id}`);
  }

  crear(usuario: Partial<ProductoStock>): Observable<ProductoStock> {
    return this.http.post<ProductoStock>(this.apiUrl, usuario);
  }

  editar(id: string, usuario: Partial<ProductoStock>): Observable<ProductoStock> {
    return this.http.put<ProductoStock>(`${this.apiUrl}/${id}`, usuario);
  }

  reactivar(id: string): Observable<boolean> {
    return this.http.patch<boolean>(`${this.apiUrl}/${id}`, id);
  }

  eliminar(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }


}