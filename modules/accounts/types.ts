import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';

import { AccountBankType, Currency } from "./constants";

@Entity('account')
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column('text')           title: string;
  @Column('text')           accountBankType: AccountBankType;
  @Column('text')           currency: Currency;
  @CreateDateColumn()       createdAt: Date;
  @UpdateDateColumn()       updatedAt: Date;
}

export type AccountInput = {
  title: string;
  accountBankType: AccountBankType;
  currency: Currency;
}
