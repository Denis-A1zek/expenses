import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { time } from 'console';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, id: number) {
    const isExsist = await this.categoryRepository.findBy({
      user: { id },
      title: createCategoryDto.title,
    });

    if (isExsist.length) {
      throw new BadRequestException('Category already exists');
    }

    const newCategory = {
      title: createCategoryDto.title,
      user: { id },
    };

    return await this.categoryRepository.save(newCategory);
  }

  async findAll(id: number) {
    return await this.categoryRepository.find({
      where: { user: { id } },
      relations: {
        transactions: true,
      },
    });
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: { user: true, transactions: true },
    });

    if (!category) {
      throw new NotFoundException('Category does not exist');
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category does not exist');
    }

    await this.categoryRepository.update(id, updateCategoryDto);
    return id;
  }

  async remove(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category does not exist');
    }

    return await this.categoryRepository.delete(id);
  }
}
