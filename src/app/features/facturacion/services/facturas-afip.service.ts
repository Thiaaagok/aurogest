// services/facturas-afip.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FacturaAfip, CreateFacturaAfipDto, TIPO_COMPROBANTE_LABELS } from '../models/factura-afip.model';
import { Config } from '../../common/config/config';

@Injectable({ providedIn: 'root' })
export class FacturasAfipService {
  private readonly api = `${Config.APIURL}/facturas-afip`;

  constructor(private http: HttpClient) {}

  emitir(dto: CreateFacturaAfipDto): Observable<FacturaAfip> {
    return this.http.post<FacturaAfip>(this.api, dto);
  }

  obtenerTodos(): Observable<FacturaAfip[]> {
    return this.http.get<FacturaAfip[]>(this.api);
  }

  obtenerPorId(id: string): Observable<FacturaAfip> {
    return this.http.get<FacturaAfip>(`${this.api}/${id}`);
  }

  obtenerPorVenta(ventaId: string): Observable<FacturaAfip[]> {
    return this.http.get<FacturaAfip[]>(`${this.api}/venta/${ventaId}`);
  }

  descargarPdf(id: string, factura: FacturaAfip): void {
    this.http.get(`${this.api}/${id}/pdf`, { responseType: 'blob' }).subscribe((blob) => {
      const nro = `${factura.prefijo ?? '0001'}-${String(factura.nroComprobante ?? 0).padStart(8, '0')}`;
      const nombre = `${TIPO_COMPROBANTE_LABELS[factura.tipoComprobante]}-${nro}.pdf`
        .replace(/ /g, '-').toLowerCase();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = nombre;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
