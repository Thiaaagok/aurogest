import { Injectable, signal } from '@angular/core';
import { ProductoModel } from '../../productos/models/producto.model';
import { VentaModel } from '../models/venta-model';

@Injectable({providedIn: 'root'})
export class VentasSignalService {
    constructor() { }

    productoSeleccionado = signal<ProductoModel | null>(null);
    grillaProductosSeleccionados = signal<ProductoModel[]>([]);
    venta = signal<VentaModel | null>(null)();
    
}