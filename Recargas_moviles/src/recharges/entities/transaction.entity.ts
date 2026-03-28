import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 10 })
  phoneNumber: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;
}
