import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventBus } from '../../domain/services/event-bus';
import { RechargeSucceededEvent } from '../../domain/events/recharge-succeeded.event';
import { Transaction } from '../../recharges/entities/transaction.entity';
import { CreateRechargeDto } from '../dto/create-recharge.dto';

/**
 * Caso de uso de aplicación para crear una recarga.
 *
 * Orquesta el flujo transaccional de negocio:
 * 1) Construye y persiste la transacción.
 * 2) Publica el evento de dominio para procesos posteriores.
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

    // Persistencia de la operación principal del caso de uso.
    const transaction = this.transactionRepository.create({
      phoneNumber,
      amount,
      userId,
    });

    const savedTransaction = await this.transactionRepository.save(transaction);

    // Evento de dominio desacoplado para auditoría/telemetría/notificaciones.
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
