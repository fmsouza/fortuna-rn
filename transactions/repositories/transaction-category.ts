import { v4 as uuid } from 'uuid';

import { TransactionCategory, TransactionCategoryInput } from "../types";
import { database } from 'shared/db';

export async function getTransactionCategories(): Promise<TransactionCategory[]> {
  const db = await database();
  const items = await db.transaction_category.find().exec();
  return items.map(fromDb);
}

export async function saveTransactionCategory(input: TransactionCategoryInput): Promise<void> {
  const db = await database();
  await db.transaction_category.insert(toDb(input));
}

type TransactionCategoryModel = Omit<TransactionCategory, 'createdAt' | 'updatedAt'> & {
  createdAt: string,
  updatedAt: string,
};

function toDb(input: TransactionCategoryInput): TransactionCategoryModel {
  return {
    ...input,
    id: uuid(),
    removable: true,
    type: input.type,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function fromDb(input: TransactionCategoryModel): TransactionCategory {
  return {
    id: input.id,
    parentId: input.parentId,
    title: input.title,
    type: input.type,
    removable: input.removable,
    createdAt: new Date(input.createdAt),
    updatedAt: new Date(input.updatedAt),

  };
}