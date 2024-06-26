import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto, id: number) {
    const newTransaction = {
      title: createTransactionDto.title,
      amount: createTransactionDto.amount,
      type: createTransactionDto.type,
      category: { id: +createTransactionDto.category },
      user: { id },
    };

    if (!newTransaction) {
      throw new BadRequestException('Invalid transaction data');
    }

    return await this.transactionRepository.save(newTransaction);
  }

  async findAll(id: number) {
    const transactions = await this.transactionRepository.find({
      where: { user: { id } },
      order: {
        createdAt: 'DESC',
      },
    });

    return transactions;
  }

  async remove(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    await this.transactionRepository.delete(id);

    return id;
  }

  async findAllWithPagination(id: number, page: number, limit: number) {
    const transactions = await this.transactionRepository.findAndCount({
      where: { user: { id } },
      order: {
        createdAt: 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return transactions;
  }
}
