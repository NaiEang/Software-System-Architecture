import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NotificationsService } from 'src/notifications/notification.service';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('ORDERS_SERVICE') private readonly client: ClientProxy,
    private readonly notifications: NotificationsService,
  ) {}

  createOrder(orderDto: any) {
    this.client.emit('order_created', {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      order: orderDto,
      createdAt: new Date().toISOString(),
    });
    this.notifications.notify('orders', 'order_created', {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      order: orderDto,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return { status: 'Order accepted', order: orderDto };
  }
}
