import { Component } from '@angular/core';
import { LogTablaBaseComponent } from './log-tabla-base.component';
import { TIPOS_SESION } from '../models/log.model';

@Component({
  selector: 'app-logs-sesiones',
  standalone: true,
  imports: [LogTablaBaseComponent],
  template: `
    <app-log-tabla-base
      categoria="SESION"
      tituloSeccion="Inicios de Sesion"
      [tiposOpciones]="tipos"
    />
  `,
})
export class LogsSesionesComponent {
  tipos = TIPOS_SESION;
}
