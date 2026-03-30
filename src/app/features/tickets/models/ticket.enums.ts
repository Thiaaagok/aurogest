export const TICKET_ESTADOS = [
  { label: 'Abierto',      value: 'ABIERTO' },
  { label: 'En progreso',  value: 'EN_PROGRESO' },
  { label: 'Resuelto',     value: 'RESUELTO' },
  { label: 'Cerrado',      value: 'CERRADO' },
];

export const TICKET_PRIORIDADES = [
  { label: 'Baja',  value: 'BAJA' },
  { label: 'Media', value: 'MEDIA' },
  { label: 'Alta',  value: 'ALTA' },
];

export const TICKET_MODULOS = [
  { label: 'Ventas',       value: 'VENTAS' },
  { label: 'Stock',        value: 'STOCK' },
  { label: 'Compras',      value: 'COMPRAS' },
  { label: 'Facturación',  value: 'FACTURACION' },
  { label: 'Usuarios',     value: 'USUARIOS' },
  { label: 'Proveedores', value: 'PROVEEDORES'},
  { label: 'Reportes', value: 'REPORTES'},
  { label: 'Otro',         value: 'OTRO' },
];


type SeveridadTag = "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined;

export function severidadEstado(estado: string): SeveridadTag {
  const map: Record<string, SeveridadTag> = {
    ABIERTO:     'warn',
    EN_PROGRESO: 'info',
    RESUELTO:    'success',
    CERRADO:     'secondary',
  };
  return map[estado] ?? 'secondary';
}

export function severidadPrioridad(prioridad: string): SeveridadTag {
  const map: Record<string, SeveridadTag> = {
    BAJA:  'success',
    MEDIA: 'warn',
    ALTA:  'danger',
  };
  return map[prioridad] ?? 'secondary';
}