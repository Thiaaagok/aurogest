import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { RendimientosService } from '../services/rendimientos.service';
import {
  AnalizarRendimientoDto,
  ProductoAnalizado,
  RendimientoAnalizado,
} from '../models/rendimiento.model';
import { CustomMaterialModule } from '../../common/material/custom-material.module';
import { PrimeNgModule } from '../../common/material/primeng.module';

Chart.register(...registerables);

interface ProductoVM extends ProductoAnalizado {
  IR: number;
  rendimientoClass: string;
  rendimientoLabel: string;
  tvPct: number;
  ctPct: number;
  irPct: number;
  expanded: boolean;
}

@Component({
  selector: 'app-rendimiento-analizado',
  standalone: true,
  imports: [CustomMaterialModule, PrimeNgModule],
  templateUrl: './rendimiento-analizado.component.html',
  styleUrl: './rendimiento-analizado.component.scss',
})
export class RendimientoAnalizadoComponent implements OnInit {
  chartExpanded = true;
  private _chartCanvas?: ElementRef<HTMLCanvasElement>;

  filtroProducto = '';
  productosFiltrados: any[] = [];

  @ViewChild('chartCanvas')
  set chartCanvasSetter(canvas: ElementRef<HTMLCanvasElement> | undefined) {
    if (canvas) {
      this._chartCanvas = canvas;
      this.renderChart();
    }
  }

  private rendimientosService = inject(RendimientosService);

  data: RendimientoAnalizado | null = null;
  productosVM: ProductoVM[] = [];
  cargando = false;
  error: string | null = null;

  totalTV = 0;
  totalCT = 0;
  totalTI = 0;
  avgRend = 0;
  avgIR = 0;

  // Parámetros del análisis — ajustar según de dónde vengan en tu app
  fechasRango: Date[] = [];
  productosId: string[] = [];

  private chart: Chart | null = null;

  ngOnInit(): void {
    const hoy = new Date();
    this.fechasRango[0] = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    this.fechasRango[1] = new Date();
    this.analizarRendimiento();
  }

  analizarRendimiento(): void {
    if (!this.fechasRango[0] || !this.fechasRango[1]) return;

    const fechaDesdeDate = new Date(this.fechasRango[0]);
    const fechaHastaDate = new Date(this.fechasRango[1]);
    fechaDesdeDate.setHours(0, 0, 0, 0);
    fechaHastaDate.setHours(23, 59, 59, 999);

    const dto = new AnalizarRendimientoDto();
    dto.FechaDesde = fechaDesdeDate.toISOString();
    dto.FechaHasta = fechaHastaDate.toISOString();
    dto.ProductosId = this.productosId;

    this.cargando = true;
    this.error = null;

    this.rendimientosService.crear(dto).subscribe({
      next: (response: RendimientoAnalizado) => {
        this.data = response;
        this.buildVM();
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al analizar el rendimiento.';
        this.cargando = false;
        console.error(err);
      },
    });
  }

  private buildVM(): void {
    if (!this.data?.ProductosAnalizados?.length) return;

    const productos = this.data.ProductosAnalizados;
    const maxVal = Math.max(
      ...productos.map((p) =>
        Math.max(p.TotalVendido, p.CostoTotal, p.TotalInvertido),
      ),
    );

    this.productosVM = productos.map((p) => {
      const IR = p.TotalInvertido - p.CostoTotal;
      const rend = p.RendimientoTotal;
      return {
        ...p,
        IR,
        rendimientoClass:
          rend >= 1.4 ? 'rend-high' : rend >= 1.1 ? 'rend-med' : 'rend-low',
        rendimientoLabel:
          rend >= 1.4 ? 'Excelente' : rend >= 1.1 ? 'Moderado' : 'Bajo',
        tvPct: Math.round((p.TotalVendido / maxVal) * 100),
        ctPct: Math.round((p.CostoTotal / maxVal) * 100),
        irPct: Math.round((IR / maxVal) * 100),
        expanded: true,
      };
    });

    this.productosFiltrados = [...this.productosVM];

    this.totalTV = productos.reduce((a, p) => a + p.TotalVendido, 0);
    this.totalCT = productos.reduce((a, p) => a + p.CostoTotal, 0);
    this.totalTI = productos.reduce((a, p) => a + p.TotalInvertido, 0);
    this.avgRend =
      productos.reduce((a, p) => a + p.RendimientoTotal, 0) / productos.length;
    this.avgIR =
      productos.reduce((a, p) => a + p.IndiceRecuperacion, 0) /
      productos.length;
  }

  private renderChart(): void {
    if (!this._chartCanvas?.nativeElement || !this.productosVM.length) return;

    if (this.chart) {
      this.chart.destroy();
    }

    const labels = this.productosVM.map((p) => {
      const nombre = p.NombreProducto ?? p.ProductoId;
      return nombre.length > 18 ? nombre.slice(0, 18) + '…' : nombre;
    });

    this.chart = new Chart(this._chartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Total vendido',
            data: this.productosVM.map((p) => p.TotalVendido),
            backgroundColor: '#34d399',
          },
          {
            label: 'Costo total',
            data: this.productosVM.map((p) => p.CostoTotal),
            backgroundColor: '#7b96ff',
          },
          {
            label: 'Stock restante (IR)',
            data: this.productosVM.map((p) => p.IR),
            backgroundColor: '#fbbf24',
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
      },
    });
  }

  toggleCard(producto: ProductoVM): void {
    producto.expanded = !producto.expanded;
  }

  fmtCurrency(n: number): string {
    return '$' + n.toLocaleString('es-AR');
  }

  fmtRatio(n: number): string {
    return (n > 999 ? 999 : n).toFixed(2) + 'x';
  }

  get chartHeight(): string {
    return this.productosVM.length * 60 + 80 + 'px';
  }

  filtrarProductos() {
    const filtro = this.filtroProducto.toLowerCase().trim();

    if (!filtro) {
      this.productosFiltrados = [...this.productosVM];
      return;
    }

    this.productosFiltrados = this.productosVM.filter((p) =>
      (p.NombreProducto ?? p.ProductoId).toLowerCase().includes(filtro),
    );
  }
}
