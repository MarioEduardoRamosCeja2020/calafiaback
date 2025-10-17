import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ResultsModule } from './results/results.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: '192.168.1.11',
      port: 1432,
      username: 'sa',
      password: '333.Calaf1a',
      database: 'stc_db',
      autoLoadEntities: true,
      synchronize: false,
      options: {
        instanceName: 'Pruebas',
        encrypt: true,
        trustServerCertificate: true,
      },
    }),
    ResultsModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
