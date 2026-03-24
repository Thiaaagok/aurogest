import { Component } from '@angular/core';
import { LogTablaBaseComponent } from './log-tabla-base.component';
import { TIPOS_ERROR } from '../models/log.model';

@Component({
  selector: 'app-logs-errores',
  standalone: true,
  imports: [LogTablaBaseComponent],
  template: `
    <app-log-tabla-base
      categoria="ERROR"
      tituloSeccion="Errores del Sistema"
      [tiposOpciones]="tipos"
    />
  `,
})
export class LogsErroresComponent {
  tipos = TIPOS_ERROR;
}
