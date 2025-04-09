import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProveedorModel } from '../models/proveedor.model';
import { Observable } from 'rxjs';
import { Config } from '../../common/config/config';

@Injectable({providedIn: 'root'})
export class ProveedoresService {
    private readonly apiUrl = `${Config.APIURL}/proveedores`;

    private http = inject(HttpClient)
  
    obtenerTodos(): Observable<ProveedorModel[]> {
      return this.http.get<ProveedorModel[]>(`${this.apiUrl}`);
    }
  
    obtenerPorId(id: string): Observable<ProveedorModel> {
      return this.http.get<ProveedorModel>(`${this.apiUrl}/${id}`);
    }
  
    crear(usuario: Partial<ProveedorModel>): Observable<ProveedorModel> {
      return this.http.post<ProveedorModel>(this.apiUrl, usuario);
    }
  
    editar(id: string, usuario: Partial<ProveedorModel>): Observable<ProveedorModel> {
      return this.http.put<ProveedorModel>(`${this.apiUrl}/${id}`, usuario);
    }
  
    reactivar(id: string): Observable<boolean> {
      return this.http.patch<boolean>(`${this.apiUrl}/${id}`, id);
    }
  
    eliminar(id: string): Observable<boolean> {
      return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
    }
  
}