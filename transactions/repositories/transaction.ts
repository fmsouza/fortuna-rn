import { v4 as uuid } from 'uuid';

import { ID, Maybe } from "shared/types";

import { Transaction, TransactionInput } from "../types";
import { database } from 'shared/db';

type GetTransactionsFilters = {
  accountId?: Maybe<ID>,
  dates?: Maybe<{ from: Date, to: Date }>,
};
export async function getTransactions(filters: GetTransactionsFilters): Promise<Transaction[]> {
  const db = await database();
  
  const andFilters = [];
  if (filters.accountId) {
    andFilters.push({ accountId: { $eq: filters.accountId } });
  }
  if (filters.dates) {
    andFilters.push({ registeredAt: { $gte: filters.dates.from.toISOString() } });
    andFilters.push({ registeredAt: { $lte: filters.dates.to.toISOString() } });
  }

  const items = await db.transaction.find({
    selector: {
      $and: andFilters
    },
    sort: [{
      registeredAt: 'desc',
    }],
  }).exec();

  return items.map(fromDb);
}

export async function transactionAlreadyExists(input: TransactionInput): Promise<boolean> {
  const db = await database();
  const count = await db.transaction.count({
    selector: {
      accountId: input.accountId,
      externalId: input.externalId,
    }
  }).exec();

  return count > 0;
}

export async function batchSaveTransactions(inputs: TransactionInput[]): Promise<number> {
  const db = await database();

  const items = inputs.map(input => toDb(input));
  const results = await db.transaction.bulkInsert(items);

  return results.success.length;
}

export async function removeTransaction(transaction: Transaction): Promise<void> {
  const db = await database();
  await db.transaction.find({
    selector: {
      id: transaction.id,
    },
  }).remove();
}

export async function removeAllTransactions(accountId?: Maybe<ID>): Promise<void> {
  const db = await database();
  await db.transaction.find({
    selector: {
      accountId: accountId ?? undefined,
    },
  }).remove();
}

export async function changeTransactionCategory(transaction: Transaction, categoryId: ID): Promise<void> {
  const db = await database();
  await db.transaction.find({
    selector: {
      id: transaction.id,
    },
  }).update({
    $set: {
      categoryId,
    },
  });
}

export async function updateTransaction(transaction: Transaction): Promise<void> {
  const db = await database();
  await db.transaction.find({
    selector: {
      id: transaction.id,
    },
  }).update({
    $set: {
      externalId: transaction.externalId,
      title: transaction.title,
      amount: transaction.amount,
      origin: transaction.origin,
      details: transaction.details,
      categoryId: transaction.categoryId,
      type: transaction.type,
    },
  });
}

export async function getTransactionMonths(accountId?: Maybe<ID>): Promise<Date[]> {
  const transaction = await getOlderTransaction(accountId);
  if (!transaction) return [];

  const today = new Date();
  const earliestDate = new Date(transaction.registeredAt);
  
  const periods: Date[] = [];
  let current = earliestDate;
  while (current <= today) {
    periods.push(current);
    current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
  }

  return periods.reverse();
}

async function getOlderTransaction(accountId?: Maybe<ID>): Promise<Maybe<Transaction>> {
  const db = await database();

  const item = await db.transaction.findOne({
    selector: {
      accountId: accountId ?? undefined,
    },
    sort: [{
      registeredAt: 'asc',
    }],
  }).exec();

  return item ? fromDb(item) : null;
}

type TransactionModel = Omit<Transaction, 'registeredAt' | 'createdAt' | 'updatedAt'> & {
  registeredAt: string,
  createdAt: string,
  updatedAt: string,
};
function toDb(input: TransactionInput): TransactionModel {
  return {
    ...input,
    id: uuid(),
    registeredAt: new Date(input.registeredAt).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function fromDb(input: TransactionModel): Transaction {
  return {
    id: input.id,
    accountId: input.accountId,
    externalId: input.externalId,
    type: input.type,
    title: input.title,
    amount: input.amount,
    origin: input.origin,
    details: input.details,
    categoryId: input.categoryId,
    registeredAt: new Date(input.registeredAt),
    createdAt: new Date(input.createdAt),
    updatedAt: new Date(input.updatedAt),
  };
}