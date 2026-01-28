import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { DobPipe } from 'src/common/pipes/dob.pipe';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() body: any) {
    return this.ordersService.createOrder(body);
  }

  @Post('test-dob')
  testDob(@Body('dob', new DobPipe()) dob: string) {
    console.log('Valid DOB received:', dob);
    return { message: 'DOB is valid', dob };
  }
}
