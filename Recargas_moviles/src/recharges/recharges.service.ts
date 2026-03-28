import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRechargeDto } from '../application/dto/create-recharge.dto';
import { CreateRechargeUseCase } from '../application/use-cases/create-recharge.use-case';
import { Transaction } from './entities/transaction.entity';

/**
 * Recharges Service
 * Adapter that coordinates use cases and repositories.
 * Delegates business logic to application use cases.
 */
@Injectable()
export class RechargesService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly createRechargeUseCase: CreateRechargeUseCase,
  ) {}

  async buyRecharge(
    createRechargeDto: CreateRechargeDto,
    userId: number,
  ): Promise<Transaction> {
    // Delegate to use case which handles business logic and events
    return await this.createRechargeUseCase.execute(createRechargeDto, userId);
  }

  async getHistory(userId: number): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}
