import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationModule } from '../application/application.module';
import { RechargesController } from './recharges.controller';
import { RechargesService } from './recharges.service';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), ApplicationModule],
  controllers: [RechargesController],
  providers: [RechargesService],
})
export class RechargesModule {}
