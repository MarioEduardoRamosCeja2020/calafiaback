export class CreateQuoteItemDto {
  cantidad: number;
  tipo: { name: string };
  contiene?: string;
  largo?: number;
  alto?: number;
  ancho?: number;
  volumenTotal: number;
}

export class CreateQuoteDto {
  nombreCliente: string;
  correoCliente: string;
  tipoCliente: string;
  origen?: { descripcion: string };
  domicilio: boolean;
  volumenAcumulado: number;
  seguro: number;
  subtotal: number;
  iva: number;
  retIva: number;
  total: number;
  observaciones: string;
  articulos: CreateQuoteItemDto[];
}
