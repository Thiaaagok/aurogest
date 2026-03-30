import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../../common/config/config';
import { AnalizarRendimientoDto, RendimientoAnalizado } from '../models/rendimiento.model';

@Injectable({
  providedIn: 'root',
})
export class RendimientosService {
  private http = inject(HttpClient);
  private apiUrl = Config.APIURL;

  crear(dto: AnalizarRendimientoDto): Observable<RendimientoAnalizado> {
    return this.http.post<RendimientoAnalizado>(`${this.apiUrl}/rendimientos`, dto);
  }
}
