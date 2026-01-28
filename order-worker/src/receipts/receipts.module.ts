import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receipt } from '../database/entities/receipts.entity';
import { ReceiptsController } from './receipts.controller';
import { ReceiptsService } from './receipts.service';
import { NotificationModule } from '../notifications/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Receipt]),
    NotificationModule.forFeature({
      featureName: 'receipts',
      prefix: '[RECEIPTS]',
      channels: ['log'],
    }),
  ],
  controllers: [ReceiptsController],
  providers: [ReceiptsService],
})
export class ReceiptsModule {}
