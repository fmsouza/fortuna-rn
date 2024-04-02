import OpenAI from 'openai';
import { dbWaitForReady } from '~/db';

import { TransactionCategory, TransactionCategoryInput } from "../types";
import { StandardTransactionCategory } from '../constants';

export async function getTransactionCategories(): Promise<TransactionCategory[]> {
  await dbWaitForReady();
  return TransactionCategory.find();
}

type UpdateTransactionCategoryInput = TransactionCategoryInput & { id: number };
type NewTransactionCategoryInput = TransactionCategoryInput & { id: never };
type SaveTransactionCategoryInput = UpdateTransactionCategoryInput | NewTransactionCategoryInput;
export async function saveTransactionCategory(input: SaveTransactionCategoryInput): Promise<void> {
  await dbWaitForReady();
  const transactionCategory = input.id ? await TransactionCategory.findOneByOrFail({ id: input.id }) : new TransactionCategory();
  transactionCategory.parentId = input.parentId;
  transactionCategory.title = input.title;
  transactionCategory.type = input.type;
  await transactionCategory.save();
}

export async function classifyTransactionDescriptionAsCategory(trxnDescription: string): Promise<TransactionCategory> {
  const transactionCategories = await getTransactionCategories();

  const categories = transactionCategories.reduce((category, obj) => {
    category[obj.title.toLowerCase()] = obj;
    return category;
  }, {} as Record<string, TransactionCategory>);

  const client = new OpenAI({
    apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
  });

  const response = await client.chat.completions.create({
    messages: [{
      role: 'user',
      content: `Categorize the transaction: "${trxnDescription}" into one of the following categories: ${Object.keys(categories).join(', ')}.`
    }],
    model: 'gpt-3.5-turbo',
    max_tokens: 1,
  });

  const category: string = response.choices[0].message.content?.trim().toLowerCase() ?? '';

  return categories[category] ?? transactionCategories.find(category => category.id === StandardTransactionCategory.UNKNOWN);
}
