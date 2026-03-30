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
import { ProductoStock } from '../../../stock/models/producto-stock.model';
import { StockService } from '../../../stock/services/stock.service';
import {
  Notificacion,
  TipoNotificacion,
} from '../../models/notificacion.model';
import { NotificacionesService } from '../../services/notificaciones.service';
import { InflacionService } from '../../services/inflacion.service';
import { AnalisisMesActual } from '../../models/inflacion.model';

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
  productosStockService = inject(StockService);
  inflacionService = inject(InflacionService);

  constructor(private messageService: MessageService) {
    this.utilitiesService.setTituloPagina('Home');
    this.utilitiesService.setearLogin(false);
  }

  productosCriticos: ProductoStock[] = [];
  loadingStock = true;

  loadStock(): void {
    this.loadingStock = true;
    this.productosStockService.obtenerCriticos().subscribe({
      next: (data) => {
        this.productosCriticos = data;
        this.loadingStock = false;
      },
      error: () => {
        this.loadingStock = false;
      },
    });
  }

  // Estados de carga
  loadingVentas = true;
  loadingDolar = true;
  loadingActividad = true;

  venta: VentasPorMes = new VentasPorMes();
  cotizaciones: Cotizacion[] = [];

  inflacionMes: AnalisisMesActual | null = null;
  loadingInflacion = true;

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
    this.loadNotificaciones();
    this.loadInflacion();

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
        this.updateChart();
        this.loadingVentas = false;
      },
      error: () => {
        this.loadingVentas = false;
      },
    });
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

  notificacionesService = inject(NotificacionesService);

  notificaciones: Notificacion[] = [];
  loadingNotificaciones = true;

  loadNotificaciones(): void {
    this.loadingNotificaciones = true;
    this.notificacionesService.obtenerNoLeidas().subscribe({
      next: (data) => {
        this.notificaciones = data;
        this.loadingNotificaciones = false;
      },
      error: () => {
        this.loadingNotificaciones = false;
      },
    });
  }

  marcarLeida(id: string): void {
    this.notificacionesService.marcarLeida(id).subscribe(() => {
      this.notificaciones = this.notificaciones.filter((n) => n.Id !== id);
    });
  }

  marcarTodasLeidas(): void {
    this.notificacionesService.marcarTodasLeidas().subscribe(() => {
      this.notificaciones = [];
    });
  }

  getIconoPorTipo(tipo: TipoNotificacion): string {
    const map: Record<TipoNotificacion, string> = {
      venta_creada: 'pi pi-shopping-cart',
      compra_creada: 'pi pi-box',
      remito_recibido: 'pi pi-truck',
      producto_modificado: 'pi pi-tag',
      usuario_creado: 'pi pi-user',
    };
    return map[tipo] ?? 'pi pi-bell';
  }

  getColorPorTipo(tipo: TipoNotificacion): string {
    const map: Record<TipoNotificacion, string> = {
      venta_creada: '#6366f1',
      compra_creada: '#06b6d4',
      remito_recibido: '#f59e0b',
      producto_modificado: '#8b5cf6',
      usuario_creado: '#10b981',
    };
    return map[tipo] ?? '#64748b';
  }

  refreshAll(): void {
    this.loadVentas();
    this.loadStock();
    this.obtenerPreciosDolar();
    this.loadNotificaciones();
    this.loadInflacion();
    this.messageService.add({
      severity: 'success',
      summary: 'Actualizado',
      detail: 'Los datos fueron recargados',
      life: 2500,
    });
  }

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

  updateChart(): void {
    const hoy = new Date();
    const diasEnMes = hoy.getDate();

    const diasCompletos = Array.from({ length: diasEnMes }, (_, i) => ({
      Dia: i + 1,
      Monto: 0,
    }));

    this.venta.PorDia.forEach((d) => {
      diasCompletos[parseInt(d.Dia) - 1].Monto = d.Monto;
    });

    this.chartData = {
      labels: diasCompletos.map((d) => `${d.Dia}`),
      datasets: [
        {
          data: diasCompletos.map((d) => d.Monto),
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
  }
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

  loadInflacion(): void {
    this.loadingInflacion = true;
    this.inflacionService.calcularMesActual().subscribe({
      next: (data) => {
        this.inflacionMes = data;
        this.loadingInflacion = false;
      },
      error: () => {
        this.loadingInflacion = false;
      },
    });
  }
}
