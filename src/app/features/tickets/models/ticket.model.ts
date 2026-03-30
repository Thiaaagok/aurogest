import { UsuarioModel } from '../../usuarios/models/usuario.model';

export type TicketEstado = 'ABIERTO' | 'EN_PROGRESO' | 'RESUELTO' | 'CERRADO';
export type TicketPrioridad = 'BAJA' | 'MEDIA' | 'ALTA';
export type TicketModulo =
  | 'VENTAS'
  | 'STOCK'
  | 'COMPRAS'
  | 'FACTURACION'
  | 'USUARIOS'
  | 'PROVEEDORES'
  | 'REPORTES'
  | 'OTRO';

export class TicketModel {
  Id: string;
  Numero: number;
  Titulo: string;
  Descripcion: string;
  Estado: TicketEstado;
  Prioridad: TicketPrioridad;
  Modulo: TicketModulo;
  Archivos?: string[];    // URL o nombre del archivo
  FechaCreacion: Date;
  FechaActualizacion: Date;
  Usuario: UsuarioModel;      // quien creó el ticket
  Comentarios: TicketComentarioModel[];
}

export class TicketComentarioModel {
  Id: string;
  Contenido: string;
  FechaCreacion: Date;
  Usuario: UsuarioModel;      // quien escribió el comentario
  TicketId: string;
}

export class CreateTicketDto {
  Id: string;
  Titulo: string;
  Descripcion: string;
  Prioridad: TicketPrioridad;
  Modulo: TicketModulo;
  Archivos?: string[];
}

export class CreateComentarioDto {
  Contenido: string;
  TicketId: string;
}

export class UpdateTicketEstadoDto {
  Estado: TicketEstado;
}
