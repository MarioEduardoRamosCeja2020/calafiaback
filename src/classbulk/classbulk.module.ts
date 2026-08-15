import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassBulk } from './classbulk.entity';
import { ClassBulkService } from './classbulk.service';
import { ClassBulkController } from './classbulk.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ClassBulk])],
  controllers: [ClassBulkController],
  providers: [ClassBulkService],
})
export class ClassBulkModule {}
