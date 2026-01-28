import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { CategoryModule } from '../category/category.module';
import { Product } from './entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [
    // 1. Link the Product entity to the database
    DatabaseModule.forFeature([Product]),
    // 2. Import CategoryModule so we can use its service to check categoryId
    CategoryModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
