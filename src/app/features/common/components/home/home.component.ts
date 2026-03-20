import { Component, inject } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.services';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { interval, startWith, Subscription } from 'rxjs';
import { CustomMaterialModule } from '../../material/custom-material.module';
import { PrimeNgModule } from '../../material/primeng.module';
import { VentasService } from '../../../ventas/services/ventas';
import { VentasPorMes } from '../../../ventas/models/venta.model';
import { CotizacionesService } from '../../services/cotizaciones.service';
import { Cotizacion } from '../../models/cotizacion.model';

@Component({
  selector: 'app-home',
  imports: [CustomMaterialModule, PrimeNgModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  utilitiesService = inject(UtilitiesService);
  ventasService = inject(VentasService);
  cotizacionesService = inject(CotizacionesService);

  constructor(
    private messageService: MessageService,
  ) {
    this.utilitiesService.setTituloPagina('Home');
    this.utilitiesService.setearLogin(false);
  }

  // Estados de carga
  loadingVentas = true;
  loadingStock = true;
  loadingDolar = true;
  loadingActividad = true;

  venta: VentasPorMes = new VentasPorMes();
  cotizaciones: Cotizacion[] = [];

  // Chart
  chartData: any;
  chartOptions: any;

  // Clock
  fechaActual = new Date();
  private subs: Subscription[] = [];
  private clockTimer?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.initChart();
    this.loadVentas();
    this.loadStock();
    /* this.loadActividad(); */

    // Dólar cada 5 min
    const dolarSub = interval(300_000)
      .pipe(startWith(0))
      .subscribe(() => this.obtenerPreciosDolar());
    this.subs.push(dolarSub);

    // Reloj
    this.clockTimer = setInterval(() => {
      this.fechaActual = new Date();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
    if (this.clockTimer) clearInterval(this.clockTimer);
  }

  // ─── Loaders ────────────────────────────────────────────────

  loadVentas(): void {
    this.loadingVentas = true;

    this.ventasService.obtenerVentasMesActual().subscribe({
      next: (data: VentasPorMes) => {
        if (!data) {
          this.loadingVentas = false;
          return;
        }
        this.venta = data;
        this.initChart();
        this.loadingVentas = false;
      },
      error: () => {
        this.loadingVentas = false;
      },
    });
  }

  loadStock(): void {
    /* this.loadingStock = true;
    setTimeout(() => {
      this.productosBajoStock = [
        {
          id: 1,
          nombre: 'Teclado Mecánico RGB',
          sku: 'TEC-001',
          stock: 2,
          minimo: 10,
          categoria: 'Periféricos',
        },
        {
          id: 2,
          nombre: 'Monitor 27" 4K',
          sku: 'MON-027',
          stock: 1,
          minimo: 5,
          categoria: 'Monitores',
        },
        {
          id: 3,
          nombre: 'SSD 1TB NVMe',
          sku: 'SSD-1TB',
          stock: 4,
          minimo: 15,
          categoria: 'Almacenamiento',
        },
        {
          id: 4,
          nombre: 'Auriculares Gamer',
          sku: 'AUD-G01',
          stock: 3,
          minimo: 8,
          categoria: 'Audio',
        },
        {
          id: 5,
          nombre: 'Webcam 4K',
          sku: 'WEB-4K1',
          stock: 0,
          minimo: 5,
          categoria: 'Periféricos',
        },
        {
          id: 6,
          nombre: 'Mouse Inalámbrico',
          sku: 'MOU-W02',
          stock: 5,
          minimo: 20,
          categoria: 'Periféricos',
        },
      ];
      this.loadingStock = false;
    }, 500); */
  }

  obtenerPreciosDolar(): void {
    this.loadingDolar = true;

    this.cotizacionesService.obtenerDolares().subscribe({
      next: (data) => {
        this.cotizaciones = data;
        this.loadingDolar = false;
      },
      error: () => {
        // fallback
        this.cotizaciones = [
          {
            Nombre: 'Oficial',
            Compra: 990,
            Venta: 1030,
            Variacion: 0.5,
            FechaActualizacion: new Date().toISOString(),
          },
        ];
        this.loadingDolar = false;
      },
    });
  }
  /*  loadActividad(): void {
    this.loadingActividad = true;
    // TODO: reemplazar con tu servicio de actividad/log real
    setTimeout(() => {
      this.actividad = [
        {
          id: 1,
          tipo: 'venta',
          titulo: 'Nueva venta registrada',
          descripcion: 'Pedido #4821 — $128.500 — Cliente: Distribuidora Sur',
          hora: 'hace 3 min',
          timestamp: new Date(),
          leido: false,
        },
        {
          id: 2,
          tipo: 'stock',
          titulo: 'Stock actualizado',
          descripcion:
            'Ingresaron 50 unidades de "SSD 500GB Samsung" — Remito #R-0091',
          hora: 'hace 15 min',
          timestamp: new Date(),
          leido: false,
        },
        {
          id: 3,
          tipo: 'precio',
          titulo: 'Lista de precios actualizada',
          descripcion:
            'El usuario admin@empresa.com actualizó 34 productos (+8% general)',
          hora: 'hace 42 min',
          timestamp: new Date(),
          leido: true,
        },
        {
          id: 4,
          tipo: 'alerta',
          titulo: 'Stock crítico detectado',
          descripcion:
            '"Webcam 4K" llegó a 0 unidades. Se sugiere generar orden de compra.',
          hora: 'hace 1 h',
          timestamp: new Date(),
          leido: false,
        },
        {
          id: 5,
          tipo: 'usuario',
          titulo: 'Nuevo usuario conectado',
          descripcion: 'ventas2@empresa.com inició sesión desde 192.168.1.45',
          hora: 'hace 2 h',
          timestamp: new Date(),
          leido: true,
        },
        {
          id: 6,
          tipo: 'venta',
          titulo: 'Venta anulada',
          descripcion:
            'Pedido #4818 fue anulado por el usuario supervisora@empresa.com',
          hora: 'hace 3 h',
          timestamp: new Date(),
          leido: true,
        },
        {
          id: 7,
          tipo: 'sistema',
          titulo: 'Backup automático completado',
          descripcion: 'Respaldo diario generado correctamente — 2.3 GB',
          hora: 'hace 6 h',
          timestamp: new Date(),
          leido: true,
        },
        {
          id: 8,
          tipo: 'precio',
          titulo: 'Proveedor actualizó costos',
          descripcion:
            'TechPro S.A. envió nueva lista: 12 productos con variación de precio',
          hora: 'hace 8 h',
          timestamp: new Date(),
          leido: true,
        },
      ];
      this.loadingActividad = false;
    }, 900);
  } */

  refreshAll(): void {
    this.loadVentas();
    this.loadStock();
    this.obtenerPreciosDolar();
    /* this.loadActividad(); */
    this.messageService.add({
      severity: 'success',
      summary: 'Actualizado',
      detail: 'Los datos fueron recargados',
      life: 2500,
    });
  }

  /*   marcarLeido(item: ActividadSistema): void {
    item.leido = true;
  }

  get actividadNoLeida(): number {
    return this.actividad.filter((a) => !a.leido).length;
  }
 */
  // ─── Chart ──────────────────────────────────────────────────

  private getCSSVar(name: string): string {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
  }

  initChart(): void {
    this.chartOptions = {
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1e293b',
          titleColor: '#94a3b8',
          bodyColor: '#f1f5f9',
          callbacks: {
            label: (ctx: any) => ` ${this.formatCurrency(ctx.raw)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(148,163,184,0.08)' },
          ticks: { color: '#64748b', font: { family: 'Sora', size: 11 } },
        },
        y: {
          grid: { color: 'rgba(148,163,184,0.08)' },
          ticks: {
            color: '#64748b',
            font: { family: 'Sora', size: 11 },
            callback: (v: number) => `$${(v / 1000).toFixed(0)}k`,
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };
  }

  /* updateChart(): void {
    this.chartData = {
      labels: this.ventas.porDia.map((d) => `${d.dia}`),
      datasets: [
        {
          data: this.ventas.porDia.map((d) => d.monto),
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99,102,241,0.12)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.45,
          pointBackgroundColor: '#6366f1',
          pointBorderColor: '#0f172a',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 8,
        },
      ],
    };
  } */

  // ─── Helpers ────────────────────────────────────────────────

  /*  getStockSeverity(p: ProductoBajoStock): 'danger' | 'warn' | 'success' {
    if (p.stock === 0) return 'danger';
    return p.stock / p.minimo < 0.4 ? 'danger' : 'warn';
  }

  getStockLabel(p: ProductoBajoStock): string {
    if (p.stock === 0) return 'Sin stock';
    return p.stock / p.minimo < 0.4 ? 'Crítico' : 'Bajo';
  }

  getStockProgress(p: ProductoBajoStock): number {
    return Math.min(Math.round((p.stock / p.minimo) * 100), 100);
  }

  getActividadIcon(tipo: ActividadTipo): string {
    const map: Record<ActividadTipo, string> = {
      venta: 'pi pi-shopping-cart',
      stock: 'pi pi-box',
      usuario: 'pi pi-user',
      precio: 'pi pi-tag',
      sistema: 'pi pi-server',
      alerta: 'pi pi-exclamation-triangle',
    };
    return map[tipo];
  }

  getActividadColor(tipo: ActividadTipo): string {
    const map: Record<ActividadTipo, string> = {
      venta: '#6366f1',
      stock: '#06b6d4',
      usuario: '#8b5cf6',
      precio: '#f59e0b',
      sistema: '#64748b',
      alerta: '#ef4444',
    };
    return map[tipo];
  }

  getActividadBg(tipo: ActividadTipo): string {
    const map: Record<ActividadTipo, string> = {
      venta: 'rgba(99,102,241,0.15)',
      stock: 'rgba(6,182,212,0.15)',
      usuario: 'rgba(139,92,246,0.15)',
      precio: 'rgba(245,158,11,0.15)',
      sistema: 'rgba(100,116,139,0.15)',
      alerta: 'rgba(239,68,68,0.15)',
    };
    return map[tipo];
  }
 */
  formatCurrency(v: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(v);
  }

  get mesActual(): string {
    return this.fechaActual.toLocaleString('es-AR', {
      month: 'long',
      year: 'numeric',
    });
  }

  get horaActual(): string {
    return this.fechaActual.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }
}
