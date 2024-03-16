import dayjs from "dayjs";

import { Account } from "~/modules/accounts/types";
import { Maybe } from "~/modules/shared/types";
import { sha256 } from "~/modules/shared/utils";

import { StandardTransactionCategory, TransactionType } from "../constants";
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
    categoryId: isIncome ? StandardTransactionCategory.INCOME : StandardTransactionCategory.OTHER,
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

const TRANSACTION_CATGEGORY_MAP: Record<string, StandardTransactionCategory> = {
  'saúde': StandardTransactionCategory.HEALTH,
  'casa': StandardTransactionCategory.HOME,
  'supermercado': StandardTransactionCategory.GROCERIES,
  'outros': StandardTransactionCategory.OTHER,
  'transporte': StandardTransactionCategory.TRANSPORTATION,
  'restaurante': StandardTransactionCategory.FOOD,
  'serviços': StandardTransactionCategory.SERVICES,
  'tax_foreign': StandardTransactionCategory.TAXES,
  'forex_delta': StandardTransactionCategory.TAXES,
  'subscription_fee': StandardTransactionCategory.TAXES,
  'viagem': StandardTransactionCategory.TRAVEL,
  'eletrônicos': StandardTransactionCategory.SHOPPING,
  'lazer': StandardTransactionCategory.ENTERTAINMENT,
  'vestuário': StandardTransactionCategory.SHOPPING,
  'insurance_payment_upfront_national': StandardTransactionCategory.TAXES,
  'educação': StandardTransactionCategory.EDUCATION,
};