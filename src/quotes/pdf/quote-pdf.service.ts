import { Injectable } from '@nestjs/common';
import * as path from 'path';
const PdfPrinter = require('pdfmake');

@Injectable()
export class QuotePdfService {
  async generate(): Promise<Buffer> {
    const fonts = {
      Roboto: {
        normal: path.join(process.cwd(), 'node_modules/pdfmake/fonts/Roboto-Regular.ttf'),
        bold: path.join(process.cwd(), 'node_modules/pdfmake/fonts/Roboto-Medium.ttf'),
        italics: path.join(process.cwd(), 'node_modules/pdfmake/fonts/Roboto-Italic.ttf'),
        bolditalics: path.join(process.cwd(), 'node_modules/pdfmake/fonts/Roboto-MediumItalic.ttf'),
      },
    };

    const printer = new PdfPrinter(fonts);
    const docDefinition = {
      content: [{ text: 'PDF SISTEMA CALAFIA - ESTADO OK', style: 'header' }],
      styles: { header: { fontSize: 18, bold: true } }
    };

    return new Promise((resolve, reject) => {
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      const chunks: Buffer[] = [];
      pdfDoc.on('data', (d) => chunks.push(d));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      pdfDoc.on('error', reject);
      pdfDoc.end();
    });
  }
}