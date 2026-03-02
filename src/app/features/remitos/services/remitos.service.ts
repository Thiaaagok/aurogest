// services/remitos.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Remito, CreateRemitoDto } from '../models/remito.model';
import { Config } from '../../common/config/config';

@Injectable({ providedIn: 'root' })
export class RemitosService {
  private readonly api = `${Config.APIURL}/remitos`;

  constructor(private http: HttpClient) {}

  crear(dto: CreateRemitoDto): Observable<Remito> {
    return this.http.post<Remito>(this.api, dto);
  }

  obtenerTodos(): Observable<Remito[]> {
    return this.http.get<Remito[]>(this.api);
  }

  obtenerPorId(id: string): Observable<Remito> {
    return this.http.get<Remito>(`${this.api}/${id}`);
  }

  obtenerPorVenta(ventaId: string): Observable<Remito> {
    return this.http.get<Remito>(`${this.api}/venta/${ventaId}`);
  }

  anular(id: string): Observable<Remito> {
    return this.http.patch<Remito>(`${this.api}/${id}/anular`, {});
  }

  obtenerRemitosPorFecha(params: {
    fechaDesde?: string;
    fechaHasta?: string;
  }): Observable<Remito[]> {

    let httpParams = new HttpParams();

    if (params.fechaDesde) {
      httpParams = httpParams.set('fechaDesde', params.fechaDesde);
    }
    if (params.fechaHasta) {
      httpParams = httpParams.set('fechaHasta', params.fechaHasta);
    }
    
    return this.http.get<Remito[]>(`${this.api}/buscar`, { params: httpParams });
  }

  // Descarga el PDF directamente en el navegador
  descargarPdf(id: string, numeroRemito: number): void {
    this.http
      .get(`${this.api}/${id}/pdf`, { responseType: 'blob' })
      .subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `remito-${String(numeroRemito).padStart(8, '0')}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }
}
