import { inject, Injectable } from '@angular/core';
import { Config } from '../../common/config/config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DepositoModel } from '../../productos/models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class DepositoService {


  private readonly apiUrl = `${Config.APIURL}/deposito`;

  private http = inject(HttpClient)

  obtenerTodos(): Observable<DepositoModel[]> {
    return this.http.get<DepositoModel[]>(`${this.apiUrl}`);
  }

  obtenerPorId(id: string): Observable<DepositoModel> {
    return this.http.get<DepositoModel>(`${this.apiUrl}/${id}`);
  }

  crear(usuario: Partial<DepositoModel>): Observable<DepositoModel> {
    return this.http.post<DepositoModel>(this.apiUrl, usuario);
  }

  editar(id: string, usuario: Partial<DepositoModel>): Observable<DepositoModel> {
    return this.http.put<DepositoModel>(`${this.apiUrl}/${id}`, usuario);
  }

  reactivar(id: string): Observable<boolean> {
    return this.http.patch<boolean>(`${this.apiUrl}/${id}`, id);
  }

  eliminar(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }

}
