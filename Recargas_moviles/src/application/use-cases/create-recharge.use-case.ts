import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventBus } from '../../domain/services/event-bus';
import { RechargeSucceededEvent } from '../../domain/events/recharge-succeeded.event';
import { Transaction } from '../../recharges/entities/transaction.entity';
import { CreateRechargeDto } from '../dto/create-recharge.dto';

/**
 * Use Case: Create Recharge (Application Service)
 * Orchestrates the creation of a recharge transaction and emits domain events.
 */
@Injectable()
export class CreateRechargeUseCase {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(createRechargeDto: CreateRechargeDto, userId: number): Promise<Transaction> {
    const { phoneNumber, amount } = createRechargeDto;

    // Create and save transaction
    const transaction = this.transactionRepository.create({
      phoneNumber,
      amount,
      userId,
    });

    const savedTransaction = await this.transactionRepository.save(transaction);

    // Emit domain event for successful recharge
    const event = new RechargeSucceededEvent(
      savedTransaction.id,
      savedTransaction.phoneNumber,
      savedTransaction.amount,
      savedTransaction.userId,
    );

    await this.eventBus.publish(event);

    return savedTransaction;
  }
}
