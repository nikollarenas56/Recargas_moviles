import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRechargeDto } from '../application/dto/create-recharge.dto';
import { CreateRechargeUseCase } from '../application/use-cases/create-recharge.use-case';
import { Transaction } from './entities/transaction.entity';

/**
 * Servicio de recargas (capa de infraestructura/aplicación).
 *
 * - Usa casos de uso para lógica de negocio.
 * - Usa repositorio solo para consultas de lectura específicas.
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
    // El caso de uso concentra reglas de negocio y publicación de eventos.
    return await this.createRechargeUseCase.execute(createRechargeDto, userId);
  }

  async getHistory(userId: number): Promise<Transaction[]> {
    // Historial del usuario autenticado, ordenado de más reciente a más antiguo.
    return this.transactionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}
