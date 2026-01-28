import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { ReceiptsController } from './receipts/receipts.controller';
import { ReceiptsService } from './receipts/receipts.service';
import { Receipt } from './database/entities/receipts.entity';
import { NotificationModule } from './notifications/notification.module';
import { CoreModule } from './core/core.module';
import { DatabaseModule } from './database/database.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { ConfigModule } from '@nestjs/config';
import { Product } from './modules/product/entities/product.entity';
import { Category } from './modules/category/entities/category.entity';
import { CustomersModule } from './modules/customers/customers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule.forRoot({
      host: process.env.DB_HOST || 'postgres',
      port: 5432,
      username: 'postgres',
      password: '2233',
      database: 'nest_db',
      entities: [Receipt, Category, Product],
    }),
    DatabaseModule.forFeature([Receipt]),
    OrdersModule,
    CategoryModule,
    ProductModule,
    NotificationModule.forRoot({
      appName: 'API_Gateway',
      defaultChannel: 'log',
      enable: true,
    }),
    CoreModule,
    CustomersModule,
  ],
  controllers: [ReceiptsController],
  providers: [ReceiptsService],
})
export class AppModule {}
