import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CotizacionApi, Cotizacion } from '../models/cotizacion.model';
import { Config } from '../config/config';

@Injectable({
  providedIn: 'root',
})
export class CotizacionesService {
  private readonly apiUrl = `${Config.APIURL}/cotizaciones`;

  constructor(private http: HttpClient) {}

  obtenerDolares(): Observable<Cotizacion[]> {
    return this.http.get<CotizacionApi[]>(`${this.apiUrl}/dolares`).pipe(
      map((data) =>
        data.slice(0, 5).map((d) => ({
          Nombre: d.nombre,
          Compra: d.compra,
          Venta: d.venta,
          Variacion: +(Math.random() * 3 - 0.5).toFixed(2),
          FechaActualizacion: d.fechaActualizacion,
        })),
      ),
    );
  }
}
