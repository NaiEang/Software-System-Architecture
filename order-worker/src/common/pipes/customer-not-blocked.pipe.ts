import { Injectable } from '@nestjs/common';
import { CustomersService } from 'src/modules/customers/customers.service';

@Injectable()
export class CustomerNotBlockedPipe {
  constructor(private readonly customersService: CustomersService) {}

  transform(value: any) {
    if (
      this.customersService.isPhoneBlocked(value) ||
      this.customersService.isNameBlacklisted(value) ||
      this.customersService.isNationalIdBlacklisted(value)
    ) {
      throw new Error('Customer is blocked');
    }
  }
}
