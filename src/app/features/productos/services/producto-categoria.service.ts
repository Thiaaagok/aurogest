import { inject, Injectable } from '@angular/core';
import { Config } from '../../common/config/config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductoCategoriaModel } from '../models/producto-categoria.model';

@Injectable({providedIn: 'root'})
export class ProductoCategoriasService {

    private readonly apiUrl = `${Config.APIURL}/productos-categorias`;

    private http = inject(HttpClient)
  
    obtenerTodos(): Observable<ProductoCategoriaModel[]> {
      return this.http.get<ProductoCategoriaModel[]>(`${this.apiUrl}`);
    }
  
    obtenerPorId(id: string): Observable<ProductoCategoriaModel> {
      return this.http.get<ProductoCategoriaModel>(`${this.apiUrl}/${id}`);
    }
  
    crear(registro: Partial<ProductoCategoriaModel>): Observable<ProductoCategoriaModel> {
      return this.http.post<ProductoCategoriaModel>(this.apiUrl, registro);
    }
  
    editar(id: string, registro: Partial<ProductoCategoriaModel>): Observable<ProductoCategoriaModel> {
      return this.http.put<ProductoCategoriaModel>(`${this.apiUrl}/${id}`, registro);
    }
  
    reactivar(id: string): Observable<boolean> {
      return this.http.patch<boolean>(`${this.apiUrl}/${id}`, id);
    }
  
    eliminar(id: string): Observable<boolean> {
      return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
    }
}