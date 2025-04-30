import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Config } from '../../common/config/config';
import { Observable } from 'rxjs';
import { ProductoModel } from '../models/producto.model';

@Injectable({providedIn: 'root'})
export class ProductosService {

    private readonly apiUrl = `${Config.APIURL}/productos`;

    private http = inject(HttpClient)
  
    obtenerTodos(): Observable<ProductoModel[]> {
      return this.http.get<ProductoModel[]>(`${this.apiUrl}`);
    }
  
    obtenerPorId(id: string): Observable<ProductoModel> {
      return this.http.get<ProductoModel>(`${this.apiUrl}/${id}`);
    }
  
    crear(usuario: Partial<ProductoModel>): Observable<ProductoModel> {
      return this.http.post<ProductoModel>(this.apiUrl, usuario);
    }
  
    editar(id: string, usuario: Partial<ProductoModel>): Observable<ProductoModel> {
      return this.http.put<ProductoModel>(`${this.apiUrl}/${id}`, usuario);
    }
  
    reactivar(id: string): Observable<boolean> {
      return this.http.patch<boolean>(`${this.apiUrl}/${id}`, id);
    }
  
    eliminar(id: string): Observable<boolean> {
      return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
    }
  
    
}