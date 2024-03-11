import { ID, Maybe } from "~/shared/types";

import { TransactionType } from "./constants";

export type Transaction = {
  id: ID;
  accountId: ID;
  externalId: string;
  type: TransactionType;
  title: string;
  amount: number;
  origin?: Maybe<string>;
  details?: Maybe<string>;
  categoryId: ID;
  registeredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type TransactionInput = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>;

export type TransactionCategory = {
  id: ID;
  parentId?: Maybe<ID>;
  title: string;
  type: TransactionCategoryType;
  removable: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type TransactionCategoryInput = Omit<TransactionCategory, 'id' | 'removable' | 'createdAt' | 'updatedAt'>;

export enum TransactionCategoryType {
  EXPENSE = 'expense',
  INCOME = 'income',
}