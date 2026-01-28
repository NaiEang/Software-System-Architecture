import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { Category } from './entities/category.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  // 1. Tell this module to use the Category repository
  imports: [DatabaseModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService],
  // 2. EXPORT the service so ProductModule can use it
  exports: [CategoryService],
})
export class CategoryModule {}
