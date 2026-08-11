import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ResultsModule } from './results/results.module';
// import { Result } from './results/result.entity';
// imports: [TypeOrmModule.forFeature([Result])]


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: '192.168.1.11',
      port: Number('1333'),
      username: 'sa',
      password: '333.Calaf1a',
      database:'stc_db',
      autoLoadEntities: true,
      synchronize: false,
      // requestTimeout: 220000, // 120 segundos si la consulta es lenta
  options: {
    encrypt: true,
    enableArithAbort: true,
    trustServerCertificate: true,
    
  },
    }),
    ResultsModule,
  ],
})
export class AppModule {}
