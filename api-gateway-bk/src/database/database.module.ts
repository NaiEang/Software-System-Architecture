import { DynamicModule, Global, Module, Type } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DATA_SOURCE } from './database.constants';

type DbOptions = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  entities: any[];
};

@Global()
@Module({})
export class DatabaseModule {
  static forRoot(options: DbOptions): DynamicModule {
    const dataSourceProvider = {
      provide: DATA_SOURCE,
      useFactory: async () => {
        const ds = new DataSource({
          type: 'postgres',
          host: options.host,
          port: options.port,
          username: options.username,
          password: options.password,
          database: options.database,
          entities: options.entities,
          synchronize: true,
        });

        return ds.initialize();
      },
    };

    return {
      module: DatabaseModule,
      providers: [dataSourceProvider],
      exports: [dataSourceProvider],
    };
  }

  static forFeature(entities: Type<any>[]): DynamicModule {
    const repoProviders = entities.map((entity) => ({
      provide: `${entity.name.toUpperCase()}_REPO`,
      useFactory: (dataSource: DataSource) => dataSource.getRepository(entity),
      inject: [DATA_SOURCE],
    }));

    return {
      module: DatabaseModule,
      providers: repoProviders,
      exports: repoProviders,
    };
  }
}
