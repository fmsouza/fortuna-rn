import dayjs from "dayjs";

import { Account } from "~/accounts/types";
import { Maybe } from "~/shared/types";
import { sha256 } from "~/shared/utils";

import { TransactionType } from "../constants";
import { TransactionInput } from "../types";

export async function transformer(account: Account, columns: string[], headers: string[]): Promise<Maybe<TransactionInput>> {
  // Only credit card extracts have a category column
  return headers.includes('category') ? creditTransformer(account, columns) : debitTransformer(account, columns);
}

export async function debitTransformer(account: Account, columns: string[]): Promise<Maybe<TransactionInput>> {
  const [
    registeredAt,
    value,
    id,
    description,
  ] = columns;

  const amount = Number(value) ?? 0;

  const [operation, title, ...others] = description.split(' - ');

  const isIncome = amount > 0;

  return {
    accountId: account.id,
    externalId: id,
    type: isIncome ? TransactionType.INCOME : TransactionType.EXPENSE,
    title: title?.trim() || operation,
    amount: Math.abs(amount),
    origin: '',
    details: [operation, ...others].join(' - '),
    categoryId: isIncome ? 'income' : 'other',
    registeredAt: dayjs(registeredAt, "DD/MM/YYYY").toDate(),
  };
}

export async function creditTransformer(account: Account, columns: string[]): Promise<Maybe<TransactionInput>> {
  const [
    registeredAt,
    category,
    title,
    value,
  ] = columns;

  if (!registeredAt || category === 'payment') {
    return null;
  }

  return {
    accountId: account.id,
    externalId: await sha256(columns.join('')),
    type: TransactionType.EXPENSE,
    title,
    amount: Number(value) ?? 0,
    origin: '',
    details: '',
    categoryId: TRANSACTION_CATGEGORY_MAP[category.toLowerCase()] ?? 'other',
    registeredAt: dayjs(registeredAt, "YYYY-MM-DD").toDate(),
  };
}

const TRANSACTION_CATGEGORY_MAP: Record<string, string> = {
  'saúde': 'health',
  'casa': 'home',
  'supermercado': 'groceries',
  'outros': 'other',
  'transporte': 'transportation',
  'restaurante': 'food',
  'serviços': 'services',
  'tax_foreign': 'taxes',
  'forex_delta': 'taxes',
  'subscription_fee': 'taxes',
  'viagem': 'travel',
  'eletrônicos': 'shopping',
  'lazer': 'entertainment',
  'vestuário': 'shopping',
  'insurance_payment_upfront_national': 'taxes',
  'educação': 'education',
};