import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotesController } from './quotes.controller';
import { QuotesService } from './quotes.service';
import { QuoteEntity } from './entities/quote.entity';
import { QuoteItemEntity } from './entities/quote-item.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    // Aquí solo van las ENTIDADES
    TypeOrmModule.forFeature([QuoteEntity, QuoteItemEntity]), 
    
    // Aquí va el MÓDULO de correo (fuera del TypeOrmModule)
    MailModule, 
  ],
  controllers: [QuotesController],
  providers: [QuotesService],
})
export class QuotesModule {}