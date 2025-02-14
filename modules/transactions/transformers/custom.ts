import dayjs from "dayjs";

import { Account } from "~/modules/accounts/types";

import { StandardTransactionCategory, TransactionType } from "../constants";
import { TransactionInput } from "../types";

export async function transformer(account: Account, columns: string[]): Promise<TransactionInput> {
  const [
    id,
    type,
    title,
    value,
    origin,
    details,
    registeredAt,
  ] = columns;

  const amount = Number(value.replace(/,/g, '.')) ?? 0;

  const isIncome = type === 'income';

  return {
      accountId: account.id,
      externalId: id,
      type: isIncome ? TransactionType.INCOME : TransactionType.EXPENSE,
      title,
      amount: Math.abs(amount),
      origin,
      details,
      categoryId: isIncome ? StandardTransactionCategory.INCOME : StandardTransactionCategory.UNKNOWN,
      registeredAt: dayjs(registeredAt, "YYYY-MM-DD").toDate(),
  };
}
