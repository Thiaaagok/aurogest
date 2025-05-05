import { inject, Injectable } from '@angular/core';
import { Config } from '../../common/config/config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductoTipoModel } from '../models/producto-tipo.model';

@Injectable({providedIn: 'root'})
export class ProductoTiposService {

    private readonly apiUrl = `${Config.APIURL}/productos-tipos`;

    private http = inject(HttpClient)
  
    obtenerTodos(): Observable<ProductoTipoModel[]> {
      return this.http.get<ProductoTipoModel[]>(`${this.apiUrl}`);
    }
  
    obtenerPorId(id: string): Observable<ProductoTipoModel> {
      return this.http.get<ProductoTipoModel>(`${this.apiUrl}/${id}`);
    }
  
    crear(usuario: Partial<ProductoTipoModel>): Observable<ProductoTipoModel> {
      return this.http.post<ProductoTipoModel>(this.apiUrl, usuario);
    }
  
    editar(id: string, usuario: Partial<ProductoTipoModel>): Observable<ProductoTipoModel> {
      return this.http.put<ProductoTipoModel>(`${this.apiUrl}/${id}`, usuario);
    }
  
    reactivar(id: string): Observable<boolean> {
      return this.http.patch<boolean>(`${this.apiUrl}/${id}`, id);
    }
  
    eliminar(id: string): Observable<boolean> {
      return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
    }
}