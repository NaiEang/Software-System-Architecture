import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { CustomersService } from '../customers.service';
import { TrimPipe } from 'src/common/pipes/trim.pipe';
import { PhoneNormalizePipe } from 'src/common/pipes/phone-normalize.pipe';
import { DobFormatAndYearPipe } from 'src/common/pipes/dob-format.pipe';
import { VerifyCustomerDto } from '../dto/verify-customer.dto';

@Injectable()
export class VerifyCustomerPipe implements PipeTransform {
  constructor(private readonly CustomersService: CustomersService) {}

  private trimmer = new TrimPipe();
  private phonePipe = new PhoneNormalizePipe();
  private dobPipe = new DobFormatAndYearPipe();

  transform(value: any): any {
    const body = value as VerifyCustomerDto;
    if (!body) {
      throw new BadRequestException('Invalid customer data');
    }

    const fullName = this.trimmer.transform(body.fullName);
    const phone = this.phonePipe.transform(body.phone);
    const dob = body.dob;
    const nationalId = body.nationalId;

    if (
      this.CustomersService.isPhoneBlocked(phone) ||
      this.CustomersService.isNameBlacklisted(fullName) ||
      this.CustomersService.isNationalIdBlacklisted(nationalId)
    ) {
      throw new BadRequestException('Customer is blocked');
    }

    return {
      fullName,
      phone,
      dob,
      nationalId: body.nationalId,
    };
  }
}
