import { Injectable } from '@angular/core';
import { EmpresaModel } from '../models/empresa.model';
import { Config } from '../../common/config/config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private readonly apiUrl = `${Config.APIURL}/empresas`;

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<EmpresaModel[]> {
    return this.http.get<EmpresaModel[]>(`${this.apiUrl}`);
  }

  obtenerPorId(id: string): Observable<EmpresaModel> {
    return this.http.get<EmpresaModel>(`${this.apiUrl}/${id}`);
  }

  crear(empresa: Partial<EmpresaModel>): Observable<EmpresaModel> {
    return this.http.post<EmpresaModel>(this.apiUrl, empresa);
  }

  editar(id: string, empresa: Partial<EmpresaModel>): Observable<EmpresaModel> {
    return this.http.put<EmpresaModel>(`${this.apiUrl}/${id}`, empresa);
  }

  reactivar(id: string): Observable<boolean> {
    return this.http.patch<boolean>(`${this.apiUrl}/${id}`, id);
  }

  eliminar(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }

}
