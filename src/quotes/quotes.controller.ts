import { Controller, Post, Body } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  async create(@Body() dto: CreateQuoteDto) {
    // Cambiado a createQuote para coincidir con tu servicio
    return this.quotesService.createQuote(dto);
  }
}