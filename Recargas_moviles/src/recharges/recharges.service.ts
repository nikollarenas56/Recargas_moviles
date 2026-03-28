import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRechargeDto } from './dto/create-recharge.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class RechargesService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async buyRecharge(
    createRechargeDto: CreateRechargeDto,
    userId: number,
  ): Promise<Transaction> {
    const { phoneNumber, amount } = createRechargeDto;

    const transaction = this.transactionRepository.create({
      phoneNumber,
      amount,
      userId,
    });

    return await this.transactionRepository.save(transaction);
  }

  async getHistory(userId: number): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}
