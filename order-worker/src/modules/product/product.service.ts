import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CategoryService } from '../category/category.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject('PRODUCT_REPO')
    private readonly productRepo: Repository<Product>,
    // This will stay red until you import CategoryModule in ProductModule
    private readonly categoryService: CategoryService,
  ) {}

  async create(dto: CreateProductDto) {
    // 1. Verify the category exists (using the service from the other module)
    await this.categoryService.findOne(dto.categoryId);

    // 2. Create product
    const product = this.productRepo.create(dto);
    return this.productRepo.save(product);
  }

  async findAll() {
    // We include 'category' so the API returns the category object too
    return this.productRepo.find({ relations: ['category'] });
  }

  async findOne(id: string) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
}
