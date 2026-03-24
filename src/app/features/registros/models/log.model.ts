export type LogCategoria = 'SESION' | 'EVENTO' | 'ERROR';

export type LogTipo =
  | 'LOGIN_EXITOSO'
  | 'LOGIN_FALLIDO'
  | 'PRODUCTO_CREADO'
  | 'PRODUCTO_EDITADO'
  | 'COMPRA_REGISTRADA'
  | 'VENTA_REGISTRADA'
  | 'REMITO_CREADO'
  | 'REMITO_ANULADO'
  | 'PROVEEDOR_CREADO'
  | 'USUARIO_CREADO'
  | 'ERROR_HTTP'
  | 'ERROR_INTERNO';

export class LogModel {
  Id: string;
  Categoria: LogCategoria;
  Tipo: LogTipo;
  Mensaje: string;
  UsuarioId: string | null;
  UsuarioNombre: string | null;
  Detalle: Record<string, any> | null;
  Ip: string | null;
  Fecha: Date;
}

export const TIPOS_SESION = [
  { label: 'Login exitoso', value: 'LOGIN_EXITOSO' },
  { label: 'Login fallido', value: 'LOGIN_FALLIDO' },
];

export const TIPOS_EVENTO = [
  { label: 'Producto creado',   value: 'PRODUCTO_CREADO'   },
  { label: 'Producto editado',  value: 'PRODUCTO_EDITADO'  },
  { label: 'Compra registrada', value: 'COMPRA_REGISTRADA' },
  { label: 'Venta registrada',  value: 'VENTA_REGISTRADA'  },
  { label: 'Remito creado',     value: 'REMITO_CREADO'     },
  { label: 'Remito anulado',    value: 'REMITO_ANULADO'    },
  { label: 'Proveedor creado',  value: 'PROVEEDOR_CREADO'  },
  { label: 'Usuario creado',    value: 'USUARIO_CREADO'    },
];

export const TIPOS_ERROR = [
  { label: 'Error HTTP',    value: 'ERROR_HTTP'    },
  { label: 'Error interno', value: 'ERROR_INTERNO' },
];

type PrimeSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

export function severidadLog(tipo: LogTipo): PrimeSeverity {
  const map: Record<string, PrimeSeverity> = {
    LOGIN_EXITOSO:    'success',
    LOGIN_FALLIDO:    'danger',
    PRODUCTO_CREADO:  'info',
    PRODUCTO_EDITADO: 'info',
    COMPRA_REGISTRADA:'info',
    VENTA_REGISTRADA: 'success',
    REMITO_CREADO:    'info',
    REMITO_ANULADO:   'warn',
    PROVEEDOR_CREADO: 'info',
    USUARIO_CREADO:   'info',
    ERROR_HTTP:       'warn',
    ERROR_INTERNO:    'danger',
  };
  return map[tipo] ?? 'secondary';
}