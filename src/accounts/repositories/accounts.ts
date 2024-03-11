import { v4 as uuid } from 'uuid';

import { ID, Maybe } from "~/shared/types";
import { database } from '~/shared/db';

import { Account } from "../types";

export async function getAccounts(): Promise<Account[]> {
  const db = await database();
  const items = await db.account.find().exec();
  return items.map(fromDb);
}

export async function getAccountById(id: ID): Promise<Maybe<Account>> {
  const db = await database();
  const item = await db.account.findOne({
    selector: {
      id,
    }
  }).exec();

  return item ? fromDb(item) : null;
}

export async function saveAccount(input: Partial<Account>): Promise<void> {
  const db = await database();

  if (input.id) {
    const { id, createdAt, ...props } = toDb(input); // createdAt is not allowed to be updated
    await db.account.findOne({ selector: { id: input.id } }).update({ $set: props });
  } else {
    await db.account.insert(toDb(input));
  }
}

export async function removeAccount(input: Account): Promise<void> {
  const db = await database();
  await db.account.findOne(input.id).remove();
}

type AccountModel = Omit<Account, 'createdAt' | 'updatedAt'> & {
  createdAt: string,
  updatedAt: string,
};

function toDb(input: Partial<Account>): AccountModel {
  return {
    id: input.id ?? uuid(),
    title: input.title!,
    accountBankType: input.accountBankType!,
    currency: input.currency!,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function fromDb(input: AccountModel): Account {
  return {
    id: input.id,
    title: input.title,
    accountBankType: input.accountBankType,
    currency: input.currency,
    createdAt: new Date(input.createdAt),
    updatedAt: new Date(input.updatedAt),
  };
}