import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Config } from "../config/config";
import { Observable } from "rxjs";
import { AnalisisMesActual } from "../models/inflacion.model";

@Injectable({ providedIn: 'root' })
export class InflacionService {
  private http = inject(HttpClient);
  private apiUrl = Config.APIURL;

  calcularMesActual(): Observable<AnalisisMesActual> {
    return this.http.get<AnalisisMesActual>(`${this.apiUrl}/inflacion/mes-actual`);
  }

  obtenerHistorial(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/inflacion/historial`);
  }
}