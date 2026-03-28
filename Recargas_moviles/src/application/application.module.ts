import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateRechargeUseCase } from './use-cases/create-recharge.use-case';
import { RechargeSucceededSubscriber } from './event-subscribers/recharge-succeeded.subscriber';
import { EventBus } from '../domain/services/event-bus';
import { Transaction } from '../recharges/entities/transaction.entity';

/**
 * Application Module
 * Defines all use cases, application services, and event subscribers.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  providers: [
    EventBus,
    CreateRechargeUseCase,
    RechargeSucceededSubscriber,
  ],
  exports: [EventBus, CreateRechargeUseCase],
})
export class ApplicationModule {}
