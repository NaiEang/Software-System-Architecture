import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class DobFormatAndYearPipe {
  transform(value: any) {
    if (typeof value !== 'string') {
      throw new Error('Date of Birth must be a string');
    }
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = value.match(regex);

    if (!match) {
      throw new Error('Date of Birth must be DD/MM/YYYY');
    }
    const year = parseInt(match[3]);

    if (year && year >= 2010) {
      throw new BadRequestException('Age must be at least 16 years old');
    }

    const month = parseInt(match[2]);
    const day = parseInt(match[1]);

    if (month == 2 && day > 28) {
      throw new BadRequestException('Incorrect day for Februrary.');
    }

    if (month > 12) {
      throw new BadRequestException('Incorrect month');
    }
    return value;
  }
}
