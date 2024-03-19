import { Between } from "typeorm";

import { Maybe } from "~/modules/shared/types";
import { dbWaitForReady } from '~/db';

import { Transaction, TransactionInput } from "../types";

type GetTransactionsFilters = {
  accountId?: Maybe<number>,
  dates?: Maybe<{ from: Date, to: Date }>,
};
export async function getTransactions(filters: GetTransactionsFilters): Promise<Transaction[]> {
  await dbWaitForReady();

  return Transaction.find({
    where: {
      accountId: filters.accountId ?? undefined,
      registeredAt: filters.dates ? Between(filters.dates.from, filters.dates.to) : undefined,
    }
  });
}

export async function transactionAlreadyExists(input: TransactionInput): Promise<boolean> {
  await dbWaitForReady();

  const count = await Transaction.count({
    where: {
      accountId: input.accountId,
      externalId: input.externalId,
    }
  });

  return count > 0;
}

export async function batchSaveTransactions(inputs: TransactionInput[]): Promise<number> {
  await dbWaitForReady();

  const items = inputs.map(input => {
    const transaction = new Transaction();
    transaction.accountId = input.accountId;
    transaction.externalId = input.externalId;
    transaction.title = input.title;
    transaction.amount = input.amount;
    transaction.origin = input.origin;
    transaction.details = input.details;
    transaction.categoryId = input.categoryId;
    transaction.type = input.type;
    transaction.registeredAt = input.registeredAt;
    return transaction;
  });

  const result = await Transaction.save(items);
  return result.length;
}

export async function removeTransaction(transaction: Transaction): Promise<void> {
  await dbWaitForReady();

  await Transaction.delete(transaction.id);
}

export async function removeAllTransactions(accountId?: Maybe<number>): Promise<void> {
  await dbWaitForReady();
  
  await Transaction.delete({
    accountId: accountId ?? undefined,
  });
}

export async function changeTransactionCategory(transaction: Transaction, categoryId: number): Promise<void> {
  await dbWaitForReady();

  await Transaction.update({
    id: transaction.id,
  }, {
    categoryId,
  });
}

export async function updateTransaction(transaction: Transaction): Promise<void> {
  await dbWaitForReady();

  await Transaction.update({
    id: transaction.id,
  }, {
    title: transaction.title,
    amount: transaction.amount,
    origin: transaction.origin,
    details: transaction.details,
    categoryId: transaction.categoryId,
    type: transaction.type,
    registeredAt: transaction.registeredAt,
  });
}

export async function getTransactionMonths(accountId?: Maybe<number>): Promise<Date[]> {
  const earliestDate = await getOlderTransactionDate(accountId);
  if (!earliestDate) return [];

  const today = new Date();
  
  const periods: Date[] = [];
  let current = earliestDate;
  while (current <= today) {
    periods.push(current);
    current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
  }

  return periods.reverse();
}

async function getOlderTransactionDate(accountId?: Maybe<number>): Promise<Maybe<Date>> {
  await dbWaitForReady();
  const queryBuilder = Transaction.createQueryBuilder('transaction')
    .select('MIN(transaction.registeredAt)', 'registeredAt');

  if (accountId) {
    queryBuilder.where('transaction.accountId = :accountId', { accountId });
  }

  const item = await queryBuilder.getOne();

  return item ? new Date(item.registeredAt) : null;
}