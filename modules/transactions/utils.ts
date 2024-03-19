import { StandardTransactionCategory, TransactionType } from "./constants";
import { Transaction } from "./types";

export function listDaysInMonth(date: Date): number[] {
  const daysInMonth = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
  return Array.from(Array(daysInMonth).keys());
}

export function aggregateByDayOfMonth(transactions: Transaction[]): Record<number, number> {
  return transactions.filter(trx => trx.type === TransactionType.EXPENSE).reduce<Record<number, number>>((acc, transaction) => {
    const dayOfMonth = transaction.registeredAt.getDate();
    if (!acc[dayOfMonth]) {
      acc[dayOfMonth] = 0;
    }
    acc[dayOfMonth] += transaction.type === TransactionType.EXPENSE ? transaction.amount : -transaction.amount;
    return acc;
  }, {});
}

export function aggregateByMonth(transactions: Transaction[]): Record<number, number> {
  return transactions.filter(trx => trx.type === TransactionType.EXPENSE).reduce<Record<number, number>>((acc, transaction) => {
    const month = transaction.registeredAt.getMonth();
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += transaction.type === TransactionType.EXPENSE ? transaction.amount : -transaction.amount;
    return acc;
  }, {});
}

export function aggregateByCategory(transactions: Transaction[]): Record<number, number> {
  return transactions.filter(trx => trx.type === TransactionType.EXPENSE).reduce<Record<number, number>>((acc, transaction) => {
    const category = transaction.categoryId;
    acc[category] = (acc[category] || 0) + transaction.amount;
    return acc;
  }, {});
}

export function aggregateByType(transactions: Transaction[]): Record<TransactionType, number> {
  return transactions.reduce<Record<TransactionType, number>>((acc, transaction) => {
    const type = transaction.type;
    acc[type] = (acc[type] || 0) + transaction.amount;
    return acc;
  }, { [TransactionType.INCOME]: 0, [TransactionType.EXPENSE]: 0});
}

export function sumTransactionsByTitle(transactions: Transaction[]): Record<string, number> {
  return transactions.reduce<Record<string, number>>((acc, transaction) => {
    const title = transaction.title;
    acc[title] = (acc[title] || 0) + transaction.amount;
    return acc;
  }, {});
}

export function countTransactionsByTitle(transactions: Transaction[]): Record<string, number> {
  return transactions.reduce<Record<string, number>>((acc, transaction) => {
    const title = transaction.title;
    acc[title] = acc[title] ? acc[title] + 1 : 1;
    return acc;
  }, {});
}

export function aggregateUncategorizedTransactionsByTitle(transactions: Transaction[]): Record<string, number> {
  const uncategorizedTransactions = transactions.filter(trx => trx.categoryId === StandardTransactionCategory.UNKNOWN);
  return countTransactionsByTitle(uncategorizedTransactions);
}

export function sanitizeText(text?: string): string {
  return text?.replace(/"/g, '') ?? '';
}