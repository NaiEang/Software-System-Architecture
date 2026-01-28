import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PhoneNormalizePipe implements PipeTransform {
  transform(value: any) {
    if (typeof value !== 'string') {
      throw new Error('Phone number must be a string');
    }

    let cleaned = value.replace(/[\s\-()]/g, '');

    if (!/^\+?[0-9]+$/.test(cleaned)) {
      throw new BadRequestException('Phone number contains invalid characters');
    }

    if (cleaned.startsWith('0')) {
      cleaned = '+855' + cleaned.substring(1);
    }
    return cleaned;
  }
}
