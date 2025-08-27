import { inject, Injectable } from '@angular/core';
import { Config } from '../../common/config/config';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  buscarCompras(params: {
    fechaDesde: string;
    fechaHasta: string;
    usuarioId?: string;
    productoId?: string;
  }): Observable<CompraModel[]> {
    let httpParams = new HttpParams()
      .set('fechaDesde', params.fechaDesde)
      .set('fechaHasta', params.fechaHasta);

    if (params.usuarioId) {
      httpParams = httpParams.set('usuarioId', params.usuarioId);
    }
    if (params.productoId) {
      httpParams = httpParams.set('productoId', params.productoId);
    }

    return this.http.get<CompraModel[]>(`${this.apiUrl}/buscar`, { params: httpParams });
  }

  obtenerPorId(id: string): Observable<CompraModel> {
    return this.http.get<CompraModel>(`${this.apiUrl}/${id}`);
  }

  crear(CompraModel: Partial<CompraModel>): Observable<CompraModel> {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    CompraModel.UsuarioId = usuario.Id
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
