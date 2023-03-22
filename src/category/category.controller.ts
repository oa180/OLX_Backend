import {
  Controller,
  Param,
  Get,
  Post,
  Body,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { Delete, HttpCode, Patch, UseGuards } from '@nestjs/common/decorators';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtGuard } from 'src/guard/jwt.guard';
import { UpdateCategoryDto } from './dto/update-category.dto';

@UseGuards(JwtGuard)
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}
  @HttpCode(200)
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @HttpCode(200)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }

  @HttpCode(201)
  @Post()
  create(@Body() creatrCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(creatrCategoryDto);
  }

  @HttpCode(200)
  @Patch(':id')
  update(
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.categoryService.update(updateCategoryDto, id);
  }

  @HttpCode(204)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.delete(id);
  }
}
