import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../../common/config/config';
import {
  AjustePrecioRequestDto,
  ProductoPrecioPreview,
  ProductoSimpleModel,
} from '../models/ajuste-precio.model';

@Injectable({ providedIn: 'root' })
export class AjustePreciosService {
  private readonly apiUrl = `${Config.APIURL}/ajuste-precios`;
  private http = inject(HttpClient);

  obtenerProductos(): Observable<ProductoSimpleModel[]> {
    return this.http.get<ProductoSimpleModel[]>(`${this.apiUrl}/productos`);
  }

  preview(dto: AjustePrecioRequestDto): Observable<ProductoPrecioPreview[]> {
    return this.http.post<ProductoPrecioPreview[]>(`${this.apiUrl}/preview`, dto);
  }

  aplicar(dto: AjustePrecioRequestDto): Observable<{ actualizados: number }> {
    return this.http.post<{ actualizados: number }>(`${this.apiUrl}/aplicar`, dto);
  }
}
