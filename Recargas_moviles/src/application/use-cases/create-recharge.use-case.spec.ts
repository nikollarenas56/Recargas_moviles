import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRechargeUseCase } from './create-recharge.use-case';
import { EventBus } from '../../domain/services/event-bus';
import { Transaction } from '../../recharges/entities/transaction.entity';
import { CreateRechargeDto } from '../dto/create-recharge.dto';
import { RechargeSucceededEvent } from '../../domain/events/recharge-succeeded.event';

describe('CreateRechargeUseCase', () => {
  let useCase: CreateRechargeUseCase;
  let repository: Repository<Transaction>;
  let eventBus: EventBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateRechargeUseCase,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: EventBus,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateRechargeUseCase>(CreateRechargeUseCase);
    repository = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
    eventBus = module.get<EventBus>(EventBus);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should create and persist a recharge, then publish an event', async () => {
    const createRechargeDto: CreateRechargeDto = {
      phoneNumber: '3001234567',
      amount: 5000,
    };

    const transactionToCreate = {
      phoneNumber: '3001234567',
      amount: 5000,
      userId: 1,
    };

    const savedTransaction = {
      id: '75fe8671-ba6a-4722-b205-275a19afc26b',
      ...transactionToCreate,
      createdAt: new Date('2026-03-28T22:03:02.000Z'),
    } as Transaction;

    jest.spyOn(repository, 'create').mockReturnValue(transactionToCreate as Transaction);
    jest.spyOn(repository, 'save').mockResolvedValue(savedTransaction);
    jest.spyOn(eventBus, 'publish').mockResolvedValue();

    const result = await useCase.execute(createRechargeDto, 1);

    expect(repository.create).toHaveBeenCalledWith({
      phoneNumber: '3001234567',
      amount: 5000,
      userId: 1,
    });
    expect(repository.save).toHaveBeenCalledWith(transactionToCreate);
    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.any(RechargeSucceededEvent),
    );
    expect(result).toEqual(savedTransaction);
  });
});
