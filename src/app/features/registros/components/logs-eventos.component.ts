import { Component } from '@angular/core';
import { TIPOS_EVENTO } from '../models/log.model';
import { LogTablaBaseComponent } from './log-tabla-base.component';

@Component({
  selector: 'app-logs-eventos',
  standalone: true,
  imports: [LogTablaBaseComponent],
  template: `
    <app-log-tabla-base
      categoria="EVENTO"
      tituloSeccion="Registros del Sistema"
      [tiposOpciones]="tipos"
    />
  `,
})
export class LogsEventosComponent {
  tipos = TIPOS_EVENTO;
}
