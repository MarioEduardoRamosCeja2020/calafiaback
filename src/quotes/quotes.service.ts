import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailService } from '../mail/mail.service';
import { QuoteEntity } from './entities/quote.entity';
import { QuoteItemEntity } from './entities/quote-item.entity';
import { CreateQuoteDto } from './dto/create-quote.dto';

const PdfPrinter = require('pdfmake');
import * as path from 'path';

@Injectable()
export class QuotesService {
  constructor(
    @InjectRepository(QuoteEntity)
    private readonly quoteRepo: Repository<QuoteEntity>,

    @InjectRepository(QuoteItemEntity)
    private readonly itemRepo: Repository<QuoteItemEntity>,

    private readonly mailService: MailService,
  ) {}

  async createQuote(dto: CreateQuoteDto) {
    try {
      /* ───── 1. GUARDAR COTIZACIÓN ───── */
      const quote = this.quoteRepo.create({
        serie: 'CAL',
        sucursal: 'Tlaquepaque',
        fecha: new Date(),
        nombre_cliente: dto.nombreCliente,
        correo_cliente: dto.correoCliente,
        tipo_cliente: dto.tipoCliente,
        ruta_origen: dto.origen?.descripcion || '',
        domicilio: dto.domicilio ?? false,
        volumen_total: Number(dto.volumenAcumulado || 0),
        seguro: Number(dto.seguro || 0),
        subtotal: Number(dto.subtotal || 0),
        iva: Number(dto.iva || 0),
        ret_iva: Number(dto.retIva || 0),
        total: Number(dto.total || 0),
        observaciones: dto.observaciones || '',
      });

      const savedQuote = await this.quoteRepo.save(quote);

      /* ───── 2. GUARDAR ARTÍCULOS ───── */
      const items = dto.articulos.map((art) => {
        const largo = Number(art.largo || 0);
        const alto = Number(art.alto || 0);
        const ancho = Number(art.ancho || 0);

        const volumen =
          largo > 0 && alto > 0 && ancho > 0
            ? largo * alto * ancho * Number(art.cantidad || 1)
            : Number(art.volumenTotal || 0);

        return this.itemRepo.create({
          quote: savedQuote,
          cantidad: Number(art.cantidad || 1),
          tipo_carga: art.tipo?.name || 'Carga',
          contenido: art.contiene || '',
          largo,
          alto,
          ancho,
          volumen_total: volumen,
        });
      });

      await this.itemRepo.save(items);

      /* ───── 3. GENERAR PDF ───── */
      const pdfBuffer = await this.generatePdfMake(savedQuote, items);

      /* ───── 4. ENVIAR CORREO ───── */
      await this.mailService.sendQuote(
        savedQuote.correo_cliente,
        pdfBuffer,
        savedQuote.id,
        this.buildEmailHtml(savedQuote),
      );

      return {
        folio: savedQuote.id,
        success: true,
        message: 'Cotización generada y enviada correctamente',
      };
    } catch (error) {
      console.error('ERROR QUOTE:', error);
      throw new InternalServerErrorException('Error al generar la cotización');
    }
  }

private buildEmailHtml(quote: QuoteEntity) {
    const whatsappNumber = '5233XXXXXXXX'; // Reemplaza con tu número (incluye código de país)
    const whatsappMessage = encodeURIComponent(`Hola, tengo una duda sobre mi cotización con folio ${quote.id}`);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    return `
    <div style="
      font-family: 'Segoe UI', Tahoma, sans-serif;
      max-width: 600px;
      margin: auto;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      overflow: hidden;
      color: #374151;
    ">
      
      <div style="background:#0b3a82; padding:20px; text-align:center;">
        <h1 style="color:#fff; margin:0;">Cotización Calafia</h1>
      </div>

      <div style="padding:25px;">
        <h2 style="margin-top:0;">¡Hola, ${quote.nombre_cliente}!</h2>

        <p>Esperamos que tengas un excelente día. Hemos generado la cotización que solicitaste con el <strong>Folio: ${quote.id}</strong>.</p>

        <div style="
          border-left: 4px solid #ef4444;
          padding-left: 15px;
          margin: 25px 0;
          line-height: 1.6;
        ">
          <p style="margin: 0; font-weight: bold; font-size: 16px;">Resumen del servicio:</p>
          <p style="margin: 0; font-size: 15px;">Origen: ${quote.ruta_origen || 'N/A'}</p>
          <p style="margin: 0; font-size: 15px;">Volumen Total: ${Number(quote.volumen_total).toFixed(3)} m³</p>
        </div>

        <div style="
          background:#f3f4f6;
          padding:20px;
          border-radius:8px;
          text-align:center;
          margin-bottom:15px;
        ">
          <p style="margin:0; font-size:14px; color:#6b7280;">Total estimado</p>
          <p style="margin:5px 0; font-size:26px; color:#0b3a82;">
            <strong>$${Number(quote.total).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong>
          </p>
        </div>

        <div style="text-align: center; margin-bottom: 25px;">
          <p style="font-size: 14px; color: #4b5563; margin-bottom: 12px;">
            Cualquier duda o aclaración, favor de contactarnos por este medio:
          </p>
          <a href="${whatsappUrl}" target="_blank" style="
            background-color: #25d366;
            color: white;
            padding: 12px 25px;
            text-decoration: none;
            font-weight: bold;
            border-radius: 8px;
            display: inline-block;
            font-size: 16px;
          ">
            Contactar por WhatsApp
          </a>
        </div>

        <p style="font-size:14px;">
          Adjuntamos el <strong>PDF con el detalle completo</strong> de la carga, precios e impuestos.
        </p>
      </div>

      <div style="
        background:#f9fafb;
        text-align:center;
        padding:15px;
        font-size:12px;
        color:#6b7280;
        border-top: 1px solid #e5e7eb;
      ">
        Calafia Logística · Tlaquepaque, Jalisco
      </div>
    </div>
    `;
  }

  /* ───────────────── GENERADOR DE PDF ───────────────── */
  private generatePdfMake(quote: QuoteEntity, items: QuoteItemEntity[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const fonts = {
          Roboto: {
            normal: path.join(process.cwd(), 'assets/fonts/Roboto-Regular.ttf'),
            bold: path.join(process.cwd(), 'assets/fonts/Roboto-Bold.ttf'),
            italics: path.join(process.cwd(), 'assets/fonts/Roboto-Italic.ttf'),
            bolditalics: path.join(process.cwd(), 'assets/fonts/Roboto-BoldItalic.ttf'),
          },
        };

        const printer = new PdfPrinter(fonts);
        const fmt = (v: any) => Number(v).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        const docDefinition = {
          pageSize: 'A4',
          pageMargins: [40, 40, 40, 40],
          content: [
            // HEADER
            {
              columns: [
                { image: path.join(process.cwd(), 'assets/calafia.png'), width: 130 },
                {
                  stack: [
                    { text: 'COTIZACIÓN', fontSize: 24, color: '#0b3a82', bold: true },
                    { text: [{ text: 'Folio: ', color: '#555' }, { text: `${quote.id}`, color: '#ef4444', bold: true }], fontSize: 14 },
                    { text: `Fecha: ${new Date(quote.fecha).toLocaleDateString('es-MX')}`, fontSize: 11, margin: [0, 5, 0, 0] }
                  ],
                  alignment: 'right'
                }
              ]
            },
            { canvas: [{ type: 'line', x1: 0, y1: 10, x2: 515, y2: 10, lineWidth: 1.5, lineColor: '#0b3a82' }], margin: [0, 0, 0, 15] },

            // CLIENTE Y RUTA
            {
              fillColor: '#f3f4f6',
              table: {
                widths: ['*', '*'],
                body: [[
                  {
                    stack: [
                      { text: 'CLIENTE', fontSize: 8, bold: true, color: '#666' },
                      { text: quote.nombre_cliente, fontSize: 13, bold: true, margin: [0, 2, 0, 0] },
                      { text: quote.correo_cliente, fontSize: 11, color: '#333' }
                    ],
                    border: [false, false, false, false], padding: [10, 10, 10, 10]
                  },
                  {
                    stack: [
                      { text: 'RUTA/SERVICIO', fontSize: 8, bold: true, color: '#666', alignment: 'right' },
                      { text: quote.ruta_origen || 'GDL/LPZ', fontSize: 13, bold: true, alignment: 'right', margin: [0, 2, 0, 0] },
                      { text: quote.domicilio ? 'Entrega a domicilio' : 'Ocurre sucursal', fontSize: 11, alignment: 'right', color: '#333' }
                    ],
                    border: [false, false, false, false], padding: [10, 10, 10, 10]
                  }
                ]]
              },
              margin: [0, 0, 0, 20]
            },

            // TABLA DE CARGA
            { text: 'DETALLE DE CARGA', fontSize: 11, bold: true, color: '#0b3a82', margin: [0, 0, 0, 8] },
            {
              table: {
                headerRows: 1,
                widths: [35, '*', 110, 85],
                body: [
                  [
                    { text: 'CANT', style: 'tableHeader', alignment: 'center' },
                    { text: 'TIPO / CONTENIDO', style: 'tableHeader' },
                    { text: 'MEDIDAS (m)', style: 'tableHeader', alignment: 'center' },
                    { text: 'VOL. m³', style: 'tableHeader', alignment: 'right' }
                  ],
                  ...items.map(i => [
                    { text: i.cantidad, alignment: 'center', fontSize: 10, margin: [0, 3] },
                    { text: `${i.tipo_carga}: ${i.contenido}`, fontSize: 10, margin: [0, 3] },
                    { 
                      text: i.largo > 0 ? `${i.largo}x${i.alto}x${i.ancho} m` : 'N/A', 
                      alignment: 'center', fontSize: 10, margin: [0, 3] 
                    },
                    { text: `${Number(i.volumen_total).toFixed(3)} m³`, alignment: 'right', fontSize: 10, margin: [0, 3] }
                  ])
                ]
              },
              layout: {
                fillColor: (i: number) => i === 0 ? '#0b3a82' : null,
                hLineColor: () => '#ddd',
                vLineColor: () => '#fff',
              }
            },

            // RESUMEN Y TOTALES
            {
              margin: [0, 15, 0, 0],
              columns: [
                {
                  stack: [
                    { text: 'OBSERVACIONES:', fontSize: 8, bold: true, color: '#555', margin: [0, 5, 0, 2] },
                    { text: quote.observaciones || 'Sin observaciones adicionales.', fontSize: 9, italics: true, color: '#444' }
                  ],
                  width: '*'
                },
                {
                  width: 190,
                  stack: [
                    {
                      columns: [
                        { text: 'VOL. ACUMULADO:', fontSize: 11, bold: true, alignment: 'right', margin: [0, 0, 10, 0] },
                        { text: `${Number(quote.volumen_total).toFixed(3)} m³`, fontSize: 11, bold: true, alignment: 'right', color: '#0b3a82' }
                      ],
                      margin: [0, 0, 0, 15]
                    },
                    {
                      table: {
                        widths: ['*', 'auto'],
                        body: [
                          [
                            { text: 'Subtotal:', style: 'label' }, 
                            { text: `$${fmt(quote.subtotal)}`, style: 'val' }
                          ],
                          [
                            { text: 'I.V.A (16%):', style: 'label' }, 
                            { text: `$${fmt(quote.iva)}`, style: 'val' }
                          ],
                          [
                            { text: 'Seguro:', style: 'label' }, 
                            { text: `$${fmt(quote.seguro)}`, style: 'val' }
                          ],
                          [
                            { text: 'Retención I.V.A:', style: 'label', color: '#ef4444' }, 
                            { text: `- $${fmt(quote.ret_iva)}`, style: 'val', color: '#ef4444' }
                          ],
                          [
                            { text: 'TOTAL:', fontSize: 14, bold: true, color: '#0b3a82', margin: [0, 8, 0, 0] }, 
                            { text: `$${fmt(quote.total)}`, fontSize: 14, bold: true, color: '#0b3a82', margin: [0, 8, 0, 0], alignment: 'right' }
                          ],
                        ]
                      },
                      layout: 'noBorders'
                    }
                  ]
                }
              ]
            }
          ],
          footer: (curr: number, total: number) => ({
            stack: [
              { canvas: [{ type: 'line', x1: 40, y1: 0, x2: 555, y2: 0, lineWidth: 0.5, lineColor: '#eee' }] },
              { text: 'Calafia Logística - Servicio Público Federal de Carga Regular · Tlaquepaque, Jal.', alignment: 'center', fontSize: 8, color: '#888', margin: [0, 5] }
            ]
          }),
          styles: {
            tableHeader: { color: 'white', bold: true, fontSize: 10, margin: [0, 3, 0, 3] },
            label: { fontSize: 10, alignment: 'right', margin: [0, 3], color: '#444' },
            val: { fontSize: 10, alignment: 'right', margin: [0, 3], bold: true }
          },
          defaultStyle: { font: 'Roboto' }
        };

        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        const chunks: any[] = [];
        pdfDoc.on('data', (c: any) => chunks.push(c));
        pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
        pdfDoc.end();
      } catch (err) {
        reject(err);
      }
    });
  }
}