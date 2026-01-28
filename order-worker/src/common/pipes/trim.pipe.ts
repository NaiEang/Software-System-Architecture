import { PipeTransform, BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value !== 'string') {
      throw new BadRequestException('Field must be a string');
    }
    const trimmed = value.trim();
    if (!trimmed) throw new BadRequestException('Field cannot be empty');
    return trimmed;
  }
}
