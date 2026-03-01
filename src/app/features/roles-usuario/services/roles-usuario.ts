import { inject, Injectable } from '@angular/core';
import { Config } from '../../common/config/config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RolUsuarioModel } from '../models/rol-usuario.model';

@Injectable({
  providedIn: 'root',
})
export class RolesUsuarioService {
  private readonly apiUrl = `${Config.APIURL}/roles-usuario`;

  private http = inject(HttpClient);

  obtenerTodos(): Observable<RolUsuarioModel[]> {
    return this.http.get<RolUsuarioModel[]>(`${this.apiUrl}`);
  }

  obtenerPorId(id: string): Observable<RolUsuarioModel> {
    return this.http.get<RolUsuarioModel>(`${this.apiUrl}/${id}`);
  }

  crear(RolUsuario: Partial<RolUsuarioModel>): Observable<RolUsuarioModel> {
    return this.http.post<RolUsuarioModel>(this.apiUrl, RolUsuario);
  }

  editar(id: string, RolUsuario: Partial<RolUsuarioModel>): Observable<RolUsuarioModel> {
    return this.http.put<RolUsuarioModel>(`${this.apiUrl}/${id}`, RolUsuario);
  }

  reactivar(id: string): Observable<boolean> {
    return this.http.patch<boolean>(`${this.apiUrl}/${id}`, id);
  }

  eliminar(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }
}
