import { HttpException, Injectable } from '@nestjs/common';
import { CRUD } from 'src/factory/crud.factory';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  crud = new CRUD();
  async findAll() {
    try {
      return this.crud.findAll(this.prisma.category);
    } catch (err) {
      throw err;
    }
  }

  async findOne(id: number) {
    try {
      return this.crud.findOne(this.prisma.category, id);
    } catch (err) {
      throw err;
    }
  }

  async create(categoryDto: CreateCategoryDto) {
    try {
      const newCategory = await this.prisma.category.create({
        data: {
          ...categoryDto,
        },
      });
      return newCategory;
    } catch (err) {
      throw err;
    }
  }

  async update(updateCategoryDto: UpdateCategoryDto, id: number) {
    try {
      return this.crud.update(this.prisma.category, id, updateCategoryDto);
    } catch (err) {
      throw err;
    }
  }

  async delete(id: number) {
    try {
      return this.crud.delete(this.prisma.category, id);
    } catch (err) {
      throw err;
    }
  }
}
