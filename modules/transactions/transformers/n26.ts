
import dayjs from "dayjs";

import { Account } from "~/modules/accounts/types";
import { Maybe } from "~/modules/shared/types";
import { sha256 } from "~/modules/shared/utils";

import { StandardTransactionCategory, TransactionType } from "../constants";
import { TransactionInput } from "../types";

export async function transformer(account: Account, columns: string[]): Promise<Maybe<TransactionInput>> {
  const [
    registeredAt,
    payee,
    accountNumber,
    transactionType,
    paymentReference,
    value,
  ] = columns;

  const amount = Number(value.replace(',', '.'));
  const origin = transactionType === 'Income' ? accountNumber : '';

  const details = paymentReference === '-' ? '' : paymentReference;

  const isIncome = transactionType === 'Income';
  const isTaxes = amount < 0 && paymentReference.includes('fee');
  const isRefunds = amount > 0 && !isIncome && !accountNumber;

  let categoryId; {
    switch(true) {
      case isTaxes:
        categoryId = StandardTransactionCategory.TAXES;
        break;
        case isRefunds:
          categoryId = StandardTransactionCategory.REFUNDS;
          break;
        case isIncome:
          categoryId = StandardTransactionCategory.INCOME;
          break;
      default:
        categoryId = StandardTransactionCategory.UNKNOWN;
        break;
    }
  };

  return {
    accountId: account.id,
    externalId: await sha256(columns.join('')),
    type: isIncome ? TransactionType.INCOME : TransactionType.EXPENSE,
    title: payee || 'Untitled',
    amount: Math.abs(amount),
    origin,
    details,
    categoryId,
    registeredAt: dayjs(registeredAt, "YYYY-MM-DD").toDate(),
  };
}
