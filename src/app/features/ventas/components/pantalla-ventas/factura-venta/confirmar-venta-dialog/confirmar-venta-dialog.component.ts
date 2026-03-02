import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-confirmar-venta-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmar-venta-dialog.component.html',
  styleUrl: './confirmar-venta-dialog.component.scss'
})
export class ConfirmarVentaDialogComponent {
  private ref = inject(DynamicDialogRef);

  paso: 'confirmar' | 'emision' = 'confirmar';

  confirmar() {
    this.paso = 'emision';
  }

  cancelar() {
    this.ref.close(null);
  }

  seleccionarEmision(tipo: 'ninguno' | 'remito' | 'factura') {
    this.ref.close(tipo);
  }
}