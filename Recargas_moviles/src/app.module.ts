import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RechargesModule } from './recharges/recharges.module';
import { Transaction } from './recharges/entities/transaction.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [Transaction],
      synchronize: true,
      logging: false,
    }),
    AuthModule,
    UsersModule,
    RechargesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
