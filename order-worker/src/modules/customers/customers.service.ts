import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomersService {
  private bloackedPhones = ['+85512345678', '+85587654321'];

  isPhoneBlocked(phone: string): boolean {
    return this.bloackedPhones.includes(phone);
  }

  isNameBlacklisted(fullName: string): boolean {
    const blacklistedNames = ['John Doe', 'Jane Smith'];
    return blacklistedNames.includes(fullName);
  }

  isNationalIdBlacklisted(nationalId: string): boolean {
    const blacklistedIds = ['ID123456', 'ID654321'];
    return blacklistedIds.includes(nationalId);
  }
}
