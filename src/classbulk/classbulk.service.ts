import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassBulk } from './classbulk.entity';

@Injectable()
export class ClassBulkService {
  constructor(
    @InjectRepository(ClassBulk)
    private readonly classBulkRepository: Repository<ClassBulk>,
  ) {}

  async findAll() {
    return this.classBulkRepository.find();
  }
}
