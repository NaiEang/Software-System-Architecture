import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
// ✅ Use a relative path to avoid 'src/' errors
import { NotificationModule } from '../notifications/notification.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ORDERS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'], // Change rabbitmq to localhost if running locally
          queue: 'orders_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
    // ✅ FIX: Call .forFeature() to register Orders-specific settings
    NotificationModule.forFeature({
      featureName: 'orders',
      prefix: '[ORDERS]',
      channels: ['log', 'telegram'], // This feature gets an extra channel
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
