import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ResultsModule } from './results/results.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import { RoutesModule } from './routes/routes.module';
import { FullRoutesModule } from './full-routes/full-routes.module';
import { ClassBulkModule } from './classbulk/classbulk.module';
import { QuotesModule } from './quotes/quotes.module';
import { ResultsUnionModule } from './resultsUnion/results-union.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // --- 1. Base de datos PRINCIPAL (usando forRootAsync para leer las variables) ---
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mssql',
        host: '192.168.1.11',
        port: Number('1333'),
        username: 'sa',
        password: '333.Calaf1a',
        database:'stc_db',
        autoLoadEntities: true,
        synchronize: false,
        options: {
          encrypt: true,
          enableArithAbort: true,
          trustServerCertificate: true,
        },
      }),
    }),

    // --- 2. Base de datos SECUNDARIA (con nombre asignado) ---
    TypeOrmModule.forRootAsync({
      name: 'conexionSecundaria', // <--- ¡Nombre obligatorio para diferenciarla!
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mssql',
        host: '192.168.1.11',
        port: Number('1333'),
        username: 'sa',
        password: '333.Calaf1a',
        database:'stcUnion_db',
        autoLoadEntities: true,
        synchronize: false,
        options: {
          encrypt: true,
          enableArithAbort: true,
          trustServerCertificate: true,
        },
      }),
    }),

    ResultsModule,
    AuthModule,
    UsersModule,
    MailModule,
    RoutesModule,
    FullRoutesModule,
    ClassBulkModule,
    QuotesModule,
    ResultsUnionModule,
  ],
})
export class AppModule {}