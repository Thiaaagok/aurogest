import { inject, Injectable } from '@angular/core';
import { Config } from '../../common/config/config';
import { HttpClient } from '@angular/common/http';
import { CompraModel } from '../models/compra.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  private readonly apiUrl = `${Config.APIURL}/compras`;

  private http = inject(HttpClient);


  obtenerTodos(): Observable<CompraModel[]> {
    return this.http.get<CompraModel[]>(`${this.apiUrl}`);
  }

  obtenerPorId(id: string): Observable<CompraModel> {
    return this.http.get<CompraModel>(`${this.apiUrl}/${id}`);
  }

  crear(CompraModel: Partial<CompraModel>): Observable<CompraModel> {
    return this.http.post<CompraModel>(this.apiUrl, CompraModel);
  }

  editar(id: string, CompraModel: Partial<CompraModel>): Observable<CompraModel> {
    return this.http.put<CompraModel>(`${this.apiUrl}/${id}`, CompraModel);
  }

  reactivar(id: string): Observable<boolean> {
    return this.http.patch<boolean>(`${this.apiUrl}/${id}`, id);
  }

  eliminar(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }

  descargarRemito(compra: CompraModel) {
    return this.http.get(`${this.apiUrl}/remito/${compra.Id}`, { responseType: 'blob' });
  }
}
