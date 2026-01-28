import { Injectable, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  private readonly processedOrders: any[] = []; // simple "DB"

  @EventPattern('order_created')
  handleOrderCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.logger.log(`Received order_created event: ${JSON.stringify(data)}`);
    this.processedOrders.push({
      ...data,
      processedAt: new Date().toISOString(),
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    channel.ack(originalMsg);
  }

  // Optional: method to view "DB" in logs
  printAll() {
    this.logger.log(
      `All processed orders: ${JSON.stringify(this.processedOrders)}`,
    );
  }
}
