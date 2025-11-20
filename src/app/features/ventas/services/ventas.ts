import { inject, Injectable, signal } from '@angular/core';
import { VentaItem, VentaModel } from '../models/venta.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Config } from '../../common/config/config';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  private readonly apiUrl = `${Config.APIURL}/ventas`;

  public ventasItem = signal<VentaItem[]>([]);
  private http = inject(HttpClient);

  constructor() { }

  obtenerPorId(id: string): Observable<VentaModel> {
    return this.http.get<VentaModel>(`${this.apiUrl}/${id}`);
  }

  buscarVentas(params: {
    fechaDesde?: string;
    fechaHasta?: string;
    productoId?: string;
  }): Observable<VentaModel[]> {

    let httpParams = new HttpParams();

    if (params.fechaDesde) {
      httpParams = httpParams.set('fechaDesde', params.fechaDesde);
    }
    if (params.fechaHasta) {
      httpParams = httpParams.set('fechaHasta', params.fechaHasta);
    }
    if (params.productoId) {
      httpParams = httpParams.set('productoId', params.productoId);
    }

    return this.http.get<VentaModel[]>(`${this.apiUrl}/buscar`, { params: httpParams });
  }

  crear(venta: Partial<VentaModel>): Observable<VentaModel> {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    venta.UsuarioId = usuario.Id;

    return this.http.post<VentaModel>(this.apiUrl, venta);
  }
}