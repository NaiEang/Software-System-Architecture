import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, RmqOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<RmqOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amq://admin:admin@localhost:5672'],
      queue: 'orders_queue',
      queueOptions: {
        durable: true,
      },
    },
  });
  app.setGlobalPrefix('api', { exclude: ['/'] });
  await app.startAllMicroservices();
  await app.listen(3000);
  console.log(`HTTP stats available on port 3002`);
}
bootstrap();
