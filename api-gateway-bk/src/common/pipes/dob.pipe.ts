import { BadRequestException, PipeTransform } from '@nestjs/common';

export class DobPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value !== 'string') {
      throw new BadRequestException('Date of Birth must be a string');
    }

    const match = value.match(/^(\d{2})[/](\d{2})[/](\d{4})$/);
    if (!match) {
      throw new BadRequestException(
        'Date of Birth must be in DD-MM-YYYY format',
      );
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
