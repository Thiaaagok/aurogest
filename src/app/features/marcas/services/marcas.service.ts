import { inject, Injectable } from '@angular/core';
import { Config } from '../../common/config/config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MarcaModel } from '../models/marca.model';

@Injectable({providedIn: 'root'})
export class MarcasService {
    
    private readonly apiUrl = `${Config.APIURL}/marcas`;

    private http = inject(HttpClient);
  
    obtenerTodos(): Observable<MarcaModel[]> {
      return this.http.get<MarcaModel[]>(`${this.apiUrl}`);
    }
  
    obtenerPorId(id: string): Observable<MarcaModel> {
      return this.http.get<MarcaModel>(`${this.apiUrl}/${id}`);
    }
  
    crear(MarcaModel: Partial<MarcaModel>): Observable<MarcaModel> {
      return this.http.post<MarcaModel>(this.apiUrl, MarcaModel);
    }
  
    editar(id: string, MarcaModel: Partial<MarcaModel>): Observable<MarcaModel> {
      return this.http.put<MarcaModel>(`${this.apiUrl}/${id}`, MarcaModel);
    }
  
    reactivar(id: string): Observable<boolean> {
      return this.http.patch<boolean>(`${this.apiUrl}/${id}`, id);
    }
  
    eliminar(id: string): Observable<boolean> {
      return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
    }
    
}