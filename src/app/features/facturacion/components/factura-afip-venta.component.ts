// factura-afip-venta/factura-afip-venta.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  FacturaAfip, CreateFacturaAfipDto, TipoComprobante,
  TRATAMIENTO_LABELS, TIPO_COMPROBANTE_LABELS, TIPO_DOC_LABELS,
  CONDICION_VENTA_LABELS,
  TratamientoImpositivo,
} from '../models/factura-afip.model';
import { FacturasAfipService } from '../services/facturas-afip.service';

@Component({
  selector: 'app-factura-afip-venta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fa-container">

      <!-- ── Lista de facturas existentes ── -->
      <div *ngIf="facturas.length > 0" class="facturas-list">
        <div *ngFor="let f of facturas" class="factura-card" [class]="'estado-' + f.estado.toLowerCase()">
          <div class="factura-card-head">
            <div>
              <span class="tipo-badge">{{ tipoLabel(f.tipoComprobante) }}</span>
              <span class="nro" *ngIf="f.nroComprobante">
                {{ f.prefijo }}-{{ f.nroComprobante | number:'8.0-0' }}
              </span>
            </div>
            <span class="estado-badge" [class]="'badge-' + f.estado.toLowerCase()">
              {{ f.estado }}
            </span>
          </div>

          <!-- CAE -->
          <div *ngIf="f.cae" class="cae-section">
            <span class="cae-label">CAE:</span>
            <span class="cae-valor">{{ f.cae }}</span>
            <span class="cae-vto">Vto: {{ f.caeVencimiento | date:'dd/MM/yyyy' }}</span>
          </div>

          <!-- Error -->
          <div *ngIf="f.estado === 'ERROR'" class="error-inline">
            ⚠ {{ f.errorMensaje }}
          </div>

          <!-- Totales -->
          <div class="totales-row">
            <span *ngIf="f.importeIVA > 0">Neto: {{ f.importeNeto | currency:'ARS':'$':'1.2-2' }} + IVA: {{ f.importeIVA | currency:'ARS':'$':'1.2-2' }}</span>
            <strong>Total: {{ f.importeTotal | currency:'ARS':'$':'1.2-2' }}</strong>
          </div>

          <!-- Receptor -->
          <div class="receptor-mini">
            {{ f.clienteRazonSocial }} · {{ f.clienteNroDocumento }} · {{ tratamientoLabel(f.clienteTratamientoImpositivo) }}
          </div>

          <div class="card-actions">
            <button class="btn btn-outline" (click)="descargarPdf(f)" [disabled]="f.estado !== 'EMITIDA'">
              ⬇ PDF
            </button>
          </div>
        </div>
      </div>

      <!-- ── Formulario nueva factura ── -->
      <div class="nueva-factura-card">
        <h3 class="card-title">📋 Nueva Factura AFIP</h3>

        <form [formGroup]="form" (ngSubmit)="emitir()">

          <!-- Tipo de comprobante -->
          <div class="field-row">
            <div class="field">
              <label>Tipo de comprobante *</label>
              <select formControlName="tipoComprobante" (change)="onTipoCambio()">
                <option value="">Seleccionar...</option>
                <optgroup label="Facturas">
                  <option value="FA">Factura A</option>
                  <option value="FB">Factura B</option>
                  <option value="FC">Factura C</option>
                </optgroup>
                <optgroup label="Notas de Crédito">
                  <option value="NCA">Nota de Crédito A</option>
                  <option value="NCB">Nota de Crédito B</option>
                  <option value="NCC">Nota de Crédito C</option>
                </optgroup>
              </select>
            </div>
            <div class="field">
              <label>Condición de venta</label>
              <select formControlName="condicionVenta">
                <option [value]="1">Contado</option>
                <option [value]="2">Cuenta Corriente</option>
                <option [value]="3">Débito</option>
                <option [value]="4">Crédito</option>
                <option [value]="5">Cheque</option>
                <option [value]="7">Otro</option>
              </select>
            </div>
          </div>

          <!-- Nota de crédito: comprobante asociado -->
          <div *ngIf="esNotaCredito" class="nc-aviso">
            <span>📎 Nota de Crédito —</span>
            <select formControlName="comprobanteAsociadoId">
              <option value="">Seleccionar factura original...</option>
              <option *ngFor="let f of facturasEmitidas" [value]="f.id">
                {{ tipoLabel(f.tipoComprobante) }} {{ f.prefijo }}-{{ f.nroComprobante }} · {{ f.clienteRazonSocial }}
              </option>
            </select>
          </div>

          <!-- Separador receptor -->
          <div class="section-title">Datos del receptor</div>

          <div class="field-row">
            <div class="field wide">
              <label>Razón Social / Nombre *</label>
              <input formControlName="clienteRazonSocial" placeholder="Nombre o razón social" />
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label>Tipo de documento *</label>
              <select formControlName="clienteTipoDocumento">
                <option value="6">CUIT</option>
                <option value="7">CUIL</option>
                <option value="1">DNI</option>
                <option value="13">Sin identificar (CF)</option>
              </select>
            </div>
            <div class="field">
              <label>Nro. documento *</label>
              <input formControlName="clienteNroDocumento" placeholder="XX-XXXXXXXX-X o DNI" />
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label>Condición IVA *</label>
              <select formControlName="clienteTratamientoImpositivo">
                <option value="2">Responsable Inscripto</option>
                <option value="1">Monotributista</option>
                <option value="3">Consumidor Final</option>
                <option value="4">IVA Exento</option>
                <option value="5">IVA No Responsable</option>
                <option value="7">IVA No Alcanzado</option>
              </select>
            </div>
            <div class="field">
              <label>Código postal</label>
              <input formControlName="clienteCodigoPostal" placeholder="XXXX" />
            </div>
          </div>

          <div class="field-row">
            <div class="field wide">
              <label>Dirección fiscal *</label>
              <input formControlName="clienteDireccionFiscal" placeholder="Calle, número, piso, ciudad" />
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label>Localidad</label>
              <input formControlName="clienteLocalidad" placeholder="Localidad" />
            </div>
            <div class="field">
              <label>Provincia</label>
              <input formControlName="clienteProvincia" placeholder="Buenos Aires" />
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label>Email</label>
              <input formControlName="clienteMail" placeholder="cliente@email.com" type="email" />
            </div>
            <div class="field toggle-row">
              <label>
                <input type="checkbox" formControlName="enviarComprobante" />
                Enviar comprobante por email
              </label>
            </div>
          </div>

          <!-- Separador extras -->
          <div class="section-title">Extras</div>

          <div class="field-row">
            <div class="field">
              <label>N° Orden de compra</label>
              <input formControlName="nroOrdenCompra" placeholder="OC-XXXXX" />
            </div>
          </div>
          <div class="field-row">
            <div class="field wide">
              <label>Observaciones</label>
              <textarea formControlName="observaciones" rows="2" placeholder="Texto adicional en el pie del comprobante..."></textarea>
            </div>
          </div>

          <!-- Resumen importes -->
          <div class="importes-preview" *ngIf="form.get('tipoComprobante')?.value">
            <div class="importes-row">
              <span>Total de la venta:</span>
              <strong>{{ totalVenta | currency:'ARS':'$':'1.2-2' }}</strong>
            </div>
            <div class="importes-nota" *ngIf="esFacturaA">
              Factura A: se informará neto + IVA 21% separados ante AFIP.
            </div>
            <div class="importes-nota" *ngIf="!esFacturaA">
              Factura B/C: importe con IVA incluido.
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" [disabled]="emitiendo || form.invalid">
              <span *ngIf="!emitiendo">🚀 Emitir ante AFIP</span>
              <span *ngIf="emitiendo">⏳ Emitiendo...</span>
            </button>
          </div>

          <div *ngIf="error" class="error-msg">{{ error }}</div>
        </form>
      </div>

    </div>
  `,
  styles: [`
    .fa-container { font-family: 'Segoe UI', sans-serif; max-width: 720px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }

    /* ── Facturas existentes ── */
    .facturas-list { display: flex; flex-direction: column; gap: 10px; }
    .factura-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 14px 16px;
      background: #fff;
      position: relative;
    }
    .factura-card.estado-emitida { border-left: 4px solid #2e7d32; }
    .factura-card.estado-error   { border-left: 4px solid #c62828; }
    .factura-card.estado-procesando { border-left: 4px solid #e65100; }

    .factura-card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .tipo-badge { font-weight: 700; font-size: .95rem; color: #1a1a2e; }
    .nro { font-size: .85rem; color: #666; margin-left: 10px; }

    .estado-badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: .72rem; font-weight: 700; text-transform: uppercase; }
    .badge-emitida    { background: #e6f4ea; color: #2e7d32; }
    .badge-procesando { background: #fff3e0; color: #e65100; }
    .badge-error      { background: #fce4e4; color: #c62828; }
    .badge-anulada    { background: #f0f0f0; color: #777; }

    .cae-section { display: flex; gap: 12px; align-items: center; font-size: .85rem; margin-bottom: 6px; padding: 6px 10px; background: #f0f7f0; border-radius: 6px; }
    .cae-label { font-weight: 700; color: #555; }
    .cae-valor { font-family: monospace; font-size: .9rem; color: #1a1a2e; }
    .cae-vto   { color: #888; font-size: .8rem; }

    .error-inline { color: #c62828; font-size: .85rem; background: #fce4e4; padding: 6px 10px; border-radius: 4px; margin-bottom: 6px; }
    .totales-row  { font-size: .88rem; color: #555; margin-bottom: 4px; display: flex; gap: 12px; align-items: center; }
    .receptor-mini { font-size: .8rem; color: #888; margin-bottom: 8px; }
    .card-actions { display: flex; gap: 8px; }

    /* ── Formulario ── */
    .nueva-factura-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 24px;
      background: #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,.05);
    }
    .card-title { font-size: 1.05rem; font-weight: 700; color: #1a1a2e; margin: 0 0 18px; }

    .section-title {
      font-size: .72rem; font-weight: 700; color: #888;
      text-transform: uppercase; letter-spacing: .07em;
      margin: 14px 0 10px;
      padding-bottom: 4px;
      border-bottom: 1px solid #f0f0f0;
    }

    .field-row { display: flex; gap: 12px; margin-bottom: 10px; flex-wrap: wrap; }
    .field { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 160px; }
    .field.wide { flex: 2; }
    label { font-size: .78rem; font-weight: 600; color: #555; }

    input, select, textarea {
      border: 1px solid #d0d0d0;
      border-radius: 6px;
      padding: 7px 10px;
      font-size: .88rem;
      outline: none;
      transition: border-color .2s;
      font-family: inherit;
    }
    input:focus, select:focus, textarea:focus { border-color: #4f73d9; }
    textarea { resize: vertical; }

    .toggle-row { justify-content: flex-end; padding-top: 22px; }
    .toggle-row label { flex-direction: row; align-items: center; gap: 6px; cursor: pointer; }

    .nc-aviso {
      background: #fff8e1;
      border: 1px solid #ffe082;
      border-radius: 6px;
      padding: 8px 12px;
      font-size: .85rem;
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }
    .nc-aviso select { flex: 1; }

    .importes-preview {
      background: #f5f7ff;
      border-radius: 6px;
      padding: 10px 14px;
      margin: 14px 0;
      font-size: .88rem;
    }
    .importes-row { display: flex; justify-content: space-between; }
    .importes-nota { font-size: .78rem; color: #888; margin-top: 4px; }

    .form-actions { display: flex; gap: 10px; margin-top: 16px; }

    .btn { padding: 9px 20px; border-radius: 6px; font-size: .9rem; font-weight: 600; cursor: pointer; border: none; transition: all .15s; }
    .btn:disabled { opacity: .55; cursor: not-allowed; }
    .btn-primary { background: #1a1a2e; color: #fff; }
    .btn-primary:hover:not(:disabled) { background: #2d2d4e; }
    .btn-outline { background: transparent; border: 1.5px solid #4f73d9; color: #4f73d9; font-size: .82rem; padding: 5px 12px; }
    .btn-outline:hover:not(:disabled) { background: #eef1fb; }
    .btn-outline:disabled { opacity: .4; }

    .error-msg { color: #c62828; background: #fce4e4; border-radius: 6px; padding: 8px 12px; margin-top: 10px; font-size: .85rem; }
  `]
})
export class FacturaAfipVentaComponent implements OnInit {
  @Input() ventaId!: string;
  @Input() totalVenta: number = 0;

  facturas: FacturaAfip[] = [];
  emitiendo = false;
  error: string | null = null;

  form: FormGroup;

  readonly tipoLabel = (t: TipoComprobante) => TIPO_COMPROBANTE_LABELS[t] ?? t;
  readonly tratamientoLabel = (t: string) => TRATAMIENTO_LABELS[t as TratamientoImpositivo] ?? t;

  constructor(
    private service: FacturasAfipService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      tipoComprobante:            ['', Validators.required],
      condicionVenta:             [1],
      comprobanteAsociadoId:      [''],
      clienteRazonSocial:         ['', Validators.required],
      clienteNroDocumento:        ['', Validators.required],
      clienteTipoDocumento:       ['6', Validators.required],
      clienteTratamientoImpositivo: ['3', Validators.required],
      clienteDireccionFiscal:     ['', Validators.required],
      clienteCodigoPostal:        [''],
      clienteLocalidad:           [''],
      clienteProvincia:           [''],
      clienteMail:                [''],
      enviarComprobante:          [false],
      nroOrdenCompra:             [''],
      observaciones:              [''],
    });
  }

  ngOnInit(): void {
    this.cargarFacturas();
  }

  get esNotaCredito(): boolean {
    return ['NCA', 'NCB', 'NCC'].includes(this.form.get('tipoComprobante')?.value);
  }

  get esFacturaA(): boolean {
    return ['FA', 'NCA'].includes(this.form.get('tipoComprobante')?.value);
  }

  get facturasEmitidas(): FacturaAfip[] {
    return this.facturas.filter((f) => f.estado === 'EMITIDA');
  }

  onTipoCambio(): void {
    const tipo: TipoComprobante = this.form.get('tipoComprobante')?.value;
    // Auto-setear condición IVA del receptor según tipo
    if (tipo === 'FA' || tipo === 'NCA') {
      this.form.get('clienteTratamientoImpositivo')?.setValue('2'); // RI
      this.form.get('clienteTipoDocumento')?.setValue('6'); // CUIT
    } else if (tipo === 'FC' || tipo === 'NCC') {
      this.form.get('clienteTratamientoImpositivo')?.setValue('1'); // Monotributista
    } else {
      this.form.get('clienteTratamientoImpositivo')?.setValue('3'); // Cons. Final
    }

    // NC requiere comprobante asociado
    if (this.esNotaCredito) {
      this.form.get('comprobanteAsociadoId')?.setValidators(Validators.required);
    } else {
      this.form.get('comprobanteAsociadoId')?.clearValidators();
    }
    this.form.get('comprobanteAsociadoId')?.updateValueAndValidity();
  }

  cargarFacturas(): void {
    if (!this.ventaId) return;
    this.service.obtenerPorVenta(this.ventaId).subscribe({
      next: (fs) => (this.facturas = fs),
      error: () => {}, // silenciar 404
    });
  }

  emitir(): void {
    if (this.form.invalid) return;
    this.emitiendo = true;
    this.error = null;

    const dto: CreateFacturaAfipDto = {
      ventaId: this.ventaId,
      ...this.form.value,
    };

    this.service.emitir(dto).subscribe({
      next: (f) => {
        this.facturas = [f, ...this.facturas];
        this.form.reset({ condicionVenta: 1, clienteTipoDocumento: '6' });
        this.emitiendo = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Error al emitir el comprobante';
        this.emitiendo = false;
      },
    });
  }

  descargarPdf(f: FacturaAfip): void {
    this.service.descargarPdf(f.id, f);
  }
}
