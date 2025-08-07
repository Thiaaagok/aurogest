import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private apiUrl = `${Config.APIURL}/facturas`;

  constructor(private http: HttpClient) { }

  generar(datosFactura: any) {
    return this.http.post(this.apiUrl, datosFactura);
  }


}
