import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-guards';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@Controller('demo')
export class DemoController {
  // This endpoint tests your ROLE logic
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin-only')
  testAdmin(): { message: string } {
    return { message: 'Success! You are an admin.' };
  }

  // This endpoint tests your PERMISSION logic
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('order.read')
  @Get('orders')
  testOrders() {
    return { message: 'Success! You can read orders.' };
  }
}
