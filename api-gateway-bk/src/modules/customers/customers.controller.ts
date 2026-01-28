import { Body, Controller, Post } from '@nestjs/common';
import { VerifyCustomerPipe } from './pipes/verify-customer.pipe';
import * as verifyCustomerDto from './dto/verify-customer.dto';

@Controller('customers')
export class CustomersController {
  @Post('verify')
  verify(@Body(VerifyCustomerPipe) body: verifyCustomerDto.VerifyCustomerDto) {
    return {
      ok: true,
      normalize: { body },
    };
  }
}
