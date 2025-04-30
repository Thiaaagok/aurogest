import { Component, inject } from '@angular/core';
import { VentasSignalService } from '../../../services/ventas-signals.service';
import { ProductoModel } from '../../../../productos/models/producto.model';
import { PrimeNgModule } from '../../../../common/material/primeng.module';

@Component({
  selector: 'app-muestra-productos',
  imports: [PrimeNgModule],
  templateUrl: './muestra-productos.component.html',
  styleUrl: './muestra-productos.component.scss',
})
export class MuestraProductosComponent { 

  limpiarFiltrado(){}

  filtrarProductos(event: Event){}

  productosFiltro: ProductoModel[] =  [];
  productos: any[] = [
    { Descripcion: 'Mouse inalámbrico', Codigo: 'PRD001', PrecioVenta: 4500 },
    { Descripcion: 'Teclado mecánico', Codigo: 'PRD002', PrecioVenta: 12500 },
    { Descripcion: 'Monitor LED 24"', Codigo: 'PRD003', PrecioVenta: 53000 },
    { Descripcion: 'Auriculares Bluetooth', Codigo: 'PRD004', PrecioVenta: 8700 },
    { Descripcion: 'Notebook 14" 8GB RAM', Codigo: 'PRD005', PrecioVenta: 230000 },
    { Descripcion: 'Impresora multifunción', Codigo: 'PRD006', PrecioVenta: 68000 },
    { Descripcion: 'Cargador USB-C', Codigo: 'PRD007', PrecioVenta: 3500 },
    { Descripcion: 'Tablet 10" 64GB', Codigo: 'PRD008', PrecioVenta: 95000 },
    { Descripcion: 'Webcam HD', Codigo: 'PRD009', PrecioVenta: 4200 },
    { Descripcion: 'Disco SSD 1TB', Codigo: 'PRD010', PrecioVenta: 64000 },
    { Descripcion: 'Placa madre AM4', Codigo: 'PRD011', PrecioVenta: 45000 },
    { Descripcion: 'Memoria RAM 16GB', Codigo: 'PRD012', PrecioVenta: 22000 },
    { Descripcion: 'Tarjeta gráfica RTX 3060', Codigo: 'PRD013', PrecioVenta: 320000 },
    { Descripcion: 'Gabinete ATX con RGB', Codigo: 'PRD014', PrecioVenta: 31000 },
    { Descripcion: 'Fuente 600W certificada', Codigo: 'PRD015', PrecioVenta: 27000 }
  ];
  
  private ventasSignals = inject(VentasSignalService);
}
