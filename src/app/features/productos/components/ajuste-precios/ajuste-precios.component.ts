import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimeNgModule } from '../../../common/material/primeng.module';
import { CustomMaterialModule } from '../../../common/material/custom-material.module';
import { FloatLabel } from 'primeng/floatlabel';
import { AjustePrecioRequestDto, ProductoPrecioPreview, ProductoSimpleModel, TipoPrecio, TIPOS_PRECIO } from '../../models/ajuste-precio.model';
import { AjustePreciosService } from '../../services/ajuste-precios.service';
import { AlertasService } from '../../../common/services/alertas.service';
import { SumByPipe } from '../../../common/pipes/sum-by.pipe';



type Paso = 'configurar' | 'preview' | 'aplicando';

@Component({
  selector: 'app-ajuste-precios',
  standalone: true,
  imports: [PrimeNgModule, CommonModule, CustomMaterialModule, FormsModule, SumByPipe],
  templateUrl: './ajuste-precios.component.html',
  styleUrl:    './ajuste-precios.component.scss',
})
export class AjustePreciosComponent {

  // ── Estado de la pantalla ─────────────────────────────────────────────────
  paso: Paso = 'configurar';

  // ── Paso 1: configuración ─────────────────────────────────────────────────
  productos: ProductoSimpleModel[] = [];
  productosSeleccionados: ProductoSimpleModel[] = [];
  todosSeleccionados = false;
  porcentaje: number | null = null;
  tipoPrecio: TipoPrecio = 'VENTA';
  tiposOpciones = TIPOS_PRECIO;
  cargandoProductos = false;

  // ── Paso 2: preview ───────────────────────────────────────────────────────
  preview: ProductoPrecioPreview[] = [];
  cargandoPreview = false;
  aplicando = false;

  private ajusteService  = inject(AjustePreciosService);
  private alertasService = inject(AlertasService);

  ngOnInit() {
    this.cargarProductos();
  }

  // ── Paso 1: selección ─────────────────────────────────────────────────────

  cargarProductos() {
    this.cargandoProductos = true;
    this.ajusteService.obtenerProductos().subscribe({
      next: (res) => { this.productos = res; this.cargandoProductos = false; },
      error: (err) => { console.error(err); this.cargandoProductos = false; },
    });
  }

  toggleTodos() {
    this.todosSeleccionados = !this.todosSeleccionados;
    this.productosSeleccionados = this.todosSeleccionados ? [...this.productos] : [];
  }

  get formularioValido(): boolean {
    return (
      this.productosSeleccionados.length > 0 &&
      this.porcentaje !== null &&
      this.porcentaje !== 0
    );
  }

  get estaAumentando(): boolean {
    return (this.porcentaje ?? 0) > 0;
  }

  // ── Paso 2: preview ───────────────────────────────────────────────────────

  calcularPreview() {
    if (!this.formularioValido) return;

    const dto: AjustePrecioRequestDto = {
      ProductoIds: this.productosSeleccionados.map(p => p.Id),
      Porcentaje:  this.porcentaje!,
      TipoPrecio:  this.tipoPrecio,
    };

    this.cargandoPreview = true;
    this.ajusteService.preview(dto).subscribe({
      next: (res) => {
        this.preview = res;
        this.cargandoPreview = false;
        this.paso = 'preview';
      },
      error: (err) => { console.error(err); this.cargandoPreview = false; },
    });
  }

  volverAConfigurar() {
    this.paso = 'configurar';
    this.preview = [];
  }

  // ── Paso 3: confirmar y aplicar ───────────────────────────────────────────

  async confirmarAplicar() {
    const accion = this.estaAumentando ? 'aumentar' : 'reducir';
    const campo  = { VENTA: 'venta', COMPRA: 'compra', AMBOS: 'venta y compra' }[this.tipoPrecio];
    const result = await this.alertasService.confirmacionAlerta(
      '¿Confirmar ajuste de precios?',
      `Se va a ${accion} el precio de ${campo} de ${this.preview.length} producto(s) en un ${Math.abs(this.porcentaje!)}%. Esta acción no se puede deshacer.`,
    );

    if (!result.isConfirmed) return;

    const dto: AjustePrecioRequestDto = {
      ProductoIds: this.productosSeleccionados.map(p => p.Id),
      Porcentaje:  this.porcentaje!,
      TipoPrecio:  this.tipoPrecio,
    };

    this.aplicando = true;
    this.ajusteService.aplicar(dto).subscribe({
      next: (res) => {
        this.aplicando = false;
        this.alertasService.advertenciaAlerta(
          '¡Precios actualizados!',
          `Se actualizaron ${res.actualizados} producto(s) correctamente.`,
        );
        this.resetear();
      },
      error: (err) => {
        console.error(err);
        this.aplicando = false;
      },
    });
  }

  resetear() {
    this.paso = 'configurar';
    this.preview = [];
    this.productosSeleccionados = [];
    this.todosSeleccionados = false;
    this.porcentaje = null;
    this.tipoPrecio = 'VENTA';
    this.cargarProductos();
  }

  // ── Helpers de template ───────────────────────────────────────────────────

  colorDiferencia(diferencia: number): string {
    if (diferencia > 0) return 'text-green-600';
    if (diferencia < 0) return 'text-red-600';
    return '';
  }

  iconoDiferencia(diferencia: number): string {
    if (diferencia > 0) return 'pi pi-arrow-up';
    if (diferencia < 0) return 'pi pi-arrow-down';
    return 'pi pi-minus';
  }

  mostrarVenta(): boolean {
    return this.tipoPrecio === 'VENTA' || this.tipoPrecio === 'AMBOS';
  }

  mostrarCompra(): boolean {
    return this.tipoPrecio === 'COMPRA' || this.tipoPrecio === 'AMBOS';
  }
}
