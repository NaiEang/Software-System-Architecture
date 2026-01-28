import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get<string>('DB_HOST', 'localhost'),
            port: configService.get<number>('DB_PORT', 5435),
            username: configService.get<string>('DB_USER', 'postgres'),
            password: configService.get<string>('DB_PASSWORD', '2233'),
            database: configService.get<string>('DB_NAME', 'nest_db'),
            autoLoadEntities: true,
            synchronize: true,
            logging: true,
          }),
        }),
      ],
    };
  }
}
