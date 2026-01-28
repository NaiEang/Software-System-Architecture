import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CATEGORY_REPO')
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto) {
    const category = this.categoryRepo.create(dto);
    return this.categoryRepo.save(category);
  }

  async findAll() {
    // We order them by name so the list looks clean
    return this.categoryRepo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category)
      throw new NotFoundException(`Category with ID ${id} not found`);
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    // merge() combines the existing category with the new data from the DTO
    const updated = this.categoryRepo.merge(category, dto);
    return this.categoryRepo.save(updated);
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    await this.categoryRepo.remove(category);
    return { deleted: true, id };
  }
}
