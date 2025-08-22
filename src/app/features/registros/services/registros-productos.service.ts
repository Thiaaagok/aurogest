import { inject, Injectable } from '@angular/core';
import { Config } from '../../common/config/config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistroActualizacionPrecio } from '../models/registroActualizacionPrecio.model';

@Injectable({ providedIn: 'root' })
export class RegistrosProductosService {

    private readonly apiUrl = `${Config.APIURL}/registros`;

    private http = inject(HttpClient);

    obtenerPorProducto(productoId: string): Observable<RegistroActualizacionPrecio[]> {
        return this.http.get<RegistroActualizacionPrecio[]>(`${this.apiUrl}/producto/${productoId}/actualizaciones-precio`);
    }
}