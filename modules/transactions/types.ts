import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  Index,
} from 'typeorm';

import { Maybe } from '~/modules/shared/types';

import { TransactionType } from "./constants";

@Entity('transaction')
@Index(['accountId', 'registeredAt'])
@Index(['accountId'])
@Index(['categoryId'])
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()           id: number;
  @Column('int')                      accountId: number;
  @Column('int')                      externalId: string;
  @Column('text')                     type: TransactionType;
  @Column('text')                     title: string;
  @Column('int')                      amount: number;
  @Column('text', { nullable: true }) origin?: Maybe<string>;
  @Column('text', { nullable: true }) details?: Maybe<string>;
  @Column('int')                      categoryId: number;
  @Column('datetime')                 registeredAt: Date;
  @CreateDateColumn()                 createdAt: Date;
  @UpdateDateColumn()                 updatedAt: Date;
}

export type TransactionInput = {
  accountId: number;
  externalId: string;
  type: TransactionType;
  title: string;
  amount: number;
  origin?: Maybe<string>;
  details?: Maybe<string>;
  categoryId: number;
  registeredAt: Date;
}

@Entity('transaction_category')
@Index(['parentId'])
export class TransactionCategory extends BaseEntity {
  @PrimaryGeneratedColumn()             id: number;
  @Column('int', { nullable: true })    parentId?: Maybe<number>;
  @Column('text')                       title: string;
  @Column('text')                       type: TransactionType;
  @Column('boolean', { default: true }) removable: boolean;
  @CreateDateColumn()                   createdAt: Date;
  @UpdateDateColumn()                   updatedAt: Date;
}


export type TransactionCategoryInput = {
  parentId?: Maybe<number>;
  title: string;
  type: TransactionType;
};