export type TipoNotificacion =
  | 'venta_creada'
  | 'compra_creada'
  | 'remito_recibido'
  | 'producto_modificado'
  | 'usuario_creado';

export interface Notificacion {
  Id: string;
  Titulo: string;
  Mensaje: string;
  Tipo: TipoNotificacion;
  Detalle?: any;
  Leida: boolean;
  FechaCreacion: string;
}