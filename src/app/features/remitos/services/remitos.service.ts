// services/remitos.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Remito, CreateRemitoDto } from '../models/remito.model';
import { Config } from '../../common/config/config';
import * as qz from 'qz-tray';

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

  private async conectarQZ(): Promise<void> {
    if (qz.websocket.isActive()) return;

    qz.security.setCertificatePromise((resolve: any) => resolve());
    qz.security.setSignatureAlgorithm('SHA512');
    qz.security.setSignaturePromise(() => (resolve: any) => resolve());

    await qz.websocket.connect();
  }

  private async desconectarQZ(): Promise<void> {
    if (qz.websocket.isActive()) {
      await qz.websocket.disconnect();
    }
  }

  async imprimirRemito(remitoId: string): Promise<void> {
  try {
    await this.conectarQZ();

    // Obtener ESC/POS como base64
    const blob = await fetch(`${this.api}/${remitoId}/imprimir-pos`)
      .then(res => res.blob());

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    const impresora = await qz.printers.getDefault();

    const config = qz.configs.create(impresora);

    // ESC/POS raw — no pixel, no PDF
    const data = [{
      type: 'raw',
      format: 'base64',
      data: base64,
    }] as any[];

    await qz.print(config, data);

  } catch (err) {
    console.error('Error al imprimir:', err);
    throw err;
  } finally {
    await this.desconectarQZ();
  }
}

  /* async imprimirRemito(remitoId: string, nombreImpresora?: string): Promise<void> {
    try {
      // 1. Conectar QZ Tray
      await this.conectarQZ();

      // 2. Obtener PDF como blob y convertir a base64
      const blob = await fetch(`${this.api}/${remitoId}/imprimir?ancho=165`)
        .then(res => res.blob());

      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]); // quitar el prefijo data:application/pdf;base64,
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      // 3. Resolver impresora — usa la indicada o busca la default
      const impresora = "POS-58 USB-002"

      // 4. Configurar trabajo de impresión
      const config = qz.configs.create(impresora, {
        size: { width: 58, height: null }, // mm
        units: 'mm',
        scaleContent: true,
      });

      // 5. Enviar PDF
      const data = [{
        type: 'pixel',
        format: 'pdf',
        flavor: 'base64',
        data: base64,
      }] as any[];

      await qz.print(config, data);

    } catch (err) {
      console.error('Error al imprimir con QZ Tray:', err);
      throw err;
    } finally {
      await this.desconectarQZ();
    }
  } */

  // ── Listar impresoras disponibles (útil para settings) ───

  async obtenerImpresoras(): Promise<string[]> {
    await this.conectarQZ();
    const impresoras = await qz.printers.find();
    await this.desconectarQZ();
    return Array.isArray(impresoras) ? impresoras : [impresoras];
  }
}
