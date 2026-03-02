// models/factura-afip.model.ts

export type TipoComprobante = 'FA' | 'FB' | 'FC' | 'NCA' | 'NCB' | 'NCC';
export type FacturaAfipEstado = 'PENDIENTE' | 'PROCESANDO' | 'EMITIDA' | 'ANULADA' | 'ERROR';

export type TratamientoImpositivo = '1' | '2' | '3' | '4' | '5' | '7';
export type TipoDocumento = '1' | '6' | '7' | '13';

export const TRATAMIENTO_LABELS: Record<TratamientoImpositivo, string> = {
  '1': 'Monotributista',
  '2': 'Responsable Inscripto',
  '3': 'Consumidor Final',
  '4': 'IVA Exento',
  '5': 'IVA No Responsable',
  '7': 'IVA No Alcanzado',
};

export const TIPO_DOC_LABELS: Record<TipoDocumento, string> = {
  '1': 'DNI',
  '6': 'CUIT',
  '7': 'CUIL',
  '13': 'Sin identificar',
};

export const TIPO_COMPROBANTE_LABELS: Record<TipoComprobante, string> = {
  FA:  'Factura A',
  FB:  'Factura B',
  FC:  'Factura C',
  NCA: 'Nota de Crédito A',
  NCB: 'Nota de Crédito B',
  NCC: 'Nota de Crédito C',
};

export const CONDICION_VENTA_LABELS: Record<number, string> = {
  1: 'Contado', 2: 'Cuenta Corriente', 3: 'Débito', 4: 'Crédito',
  5: 'Cheque', 6: 'Ticket', 7: 'Otro',
};

export interface FacturaAfip {
  id: string;
  ventaId: string;
  tipoComprobante: TipoComprobante;
  estado: FacturaAfipEstado;
  cae?: string;
  caeVencimiento?: Date;
  nroComprobante?: number;
  prefijo?: string;
  clienteRazonSocial: string;
  clienteNroDocumento: string;
  clienteTratamientoImpositivo: TratamientoImpositivo;
  importeNeto: number;
  importeIVA: number;
  importeTotal: number;
  condicionVenta: number;
  observaciones?: string;
  errorMensaje?: string;
  fechaCreacion: Date;
  venta: {
    id: string;
    fecha: Date;
    total: number;
    items: { descripcion: string; cantidad: number; subtotal: number }[];
  };
}

export interface CreateFacturaAfipDto {
  ventaId: string;
  tipoComprobante: TipoComprobante;
  clienteRazonSocial: string;
  clienteNroDocumento: string;
  clienteTipoDocumento: TipoDocumento;
  clienteTratamientoImpositivo: TratamientoImpositivo;
  clienteDireccionFiscal: string;
  clienteCodigoPostal?: string;
  clienteLocalidad?: string;
  clienteProvincia?: string;
  clienteMail?: string;
  condicionVenta?: number;
  comprobanteAsociadoId?: string;
  observaciones?: string;
  nroOrdenCompra?: string;
  enviarComprobante?: boolean;
}
