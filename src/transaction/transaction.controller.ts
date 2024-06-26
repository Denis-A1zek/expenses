import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  create(@Body() createTransactionDto: CreateTransactionDto, @Req() req) {
    return this.transactionService.create(createTransactionDto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req) {
    return this.transactionService.findAll(req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.transactionService.remove(+id);
  }

  @Get('pagination')
  @UseGuards(JwtAuthGuard)
  findPaged(
    @Req() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ) {
    return this.transactionService.findAllWithPagination(
      +req.user.id,
      +page,
      +limit,
    );
  }
}
