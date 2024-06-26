import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Category } from 'src/category/entities/category.entity';

export class CreateTransactionDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsString()
  @MinLength(6)
  type: 'expanse' | 'income';

  @IsNotEmpty()
  category: Category;
}
