import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { PrimeNgModule } from '../../../../../common/material/primeng.module';

export interface DatosRemitoEmision {
  observaciones?: string;
  receptorNombre?: string;
  receptorDireccion?: string;
  receptorCuit?: string;
}

@Component({
  selector: 'app-datos-remito-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, PrimeNgModule],
  templateUrl: './datos-remito-dialog.component.html',
  styleUrl: './datos-remito-dialog.component.scss',
})
export class DatosRemitoDialogComponent {
  observaciones?: string;
  receptorNombre?: string;
  receptorDireccion?: string;
  receptorCuit?: string;

  constructor(private ref: DynamicDialogRef) {}

  omitir() {
    // Cierra emitiendo objeto vacío — se crea el remito sin datos opcionales
    this.ref.close({} as DatosRemitoEmision);
  }

  crear() {
    this.ref.close({
      observaciones: this.observaciones,
      receptorNombre: this.receptorNombre,
      receptorDireccion: this.receptorDireccion,
      receptorCuit: this.receptorCuit,
    } as DatosRemitoEmision);
  }

  cancelar() {
    this.ref.close(null); // null = no crear remito
  }
}