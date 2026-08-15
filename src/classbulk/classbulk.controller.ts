import { Controller, Get } from '@nestjs/common';
import { ClassBulkService } from './classbulk.service';

@Controller('classbulk')
export class ClassBulkController {
  constructor(private readonly classBulkService: ClassBulkService) {}

  @Get()
  findAll() {
    return this.classBulkService.findAll();
  }
}
