import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QrScannerService {

  qrScanned = new EventEmitter<string>();

  private qrCode = '';
  private timeout: any;

  constructor() {
    document.addEventListener('keydown', (e: KeyboardEvent) => this.handleKey(e));
  }

  private handleKey(e: KeyboardEvent) {
    if (this.timeout) clearTimeout(this.timeout);

    if (e.key === 'Enter') {
      if (this.qrCode.length > 0) {
        this.qrScanned.emit(this.qrCode); // Emitimos el QR escaneado
        this.qrCode = '';
      }
    } else {
      this.qrCode += e.key; // Acumulamos los caracteres
    }

    // Limpiar el buffer si no llega otro caracter en 50ms
    this.timeout = setTimeout(() => {
      this.qrCode = '';
    }, 50);
  }
}
