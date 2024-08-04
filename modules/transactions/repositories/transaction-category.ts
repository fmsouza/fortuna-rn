import OpenAI from "openai";
import { dbWaitForReady } from "~/db";

import { TransactionCategory, TransactionCategoryInput } from "../types";
import { CategorizationAgent } from "~/modules/shared/agents";

export async function getTransactionCategories(): Promise<
  TransactionCategory[]
> {
  await dbWaitForReady();
  return TransactionCategory.find();
}

type UpdateTransactionCategoryInput = TransactionCategoryInput & { id: number };
type NewTransactionCategoryInput = TransactionCategoryInput & { id: never };
type SaveTransactionCategoryInput =
  | UpdateTransactionCategoryInput
  | NewTransactionCategoryInput;
export async function saveTransactionCategory(
  input: SaveTransactionCategoryInput,
): Promise<void> {
  await dbWaitForReady();
  const transactionCategory = input.id
    ? await TransactionCategory.findOneByOrFail({ id: input.id })
    : new TransactionCategory();
  transactionCategory.parentId = input.parentId;
  transactionCategory.title = input.title;
  transactionCategory.type = input.type;
  await transactionCategory.save();
}

export async function classifyTransactionDescriptionAsCategory(
  trxnDescription: string,
): Promise<TransactionCategory> {
  const transactionCategories = await getTransactionCategories();
  const categorizationAgent = new CategorizationAgent(transactionCategories);
  return categorizationAgent.categorize(trxnDescription);
}
