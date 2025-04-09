import { ElementRef, Injectable } from '@angular/core';
import { Table } from 'primeng/table';


@Injectable({
  providedIn: 'root'
})
export class GrillaUtilService {

  cargarGrilla<T>(data: T[], mostrarActivos: boolean): T[] {
    return data.filter(x => (x as any).Activo === mostrarActivos);
  }

  limpiarFiltrado(table: Table, inputRef?: ElementRef<HTMLInputElement>) {
    table.clear();
    if (inputRef) inputRef.nativeElement.value = '';
  }

  filtrarGlobal(table: Table, event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    table.filterGlobal(valor, 'contains');
  }
}
