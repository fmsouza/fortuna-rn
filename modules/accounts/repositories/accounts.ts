import { Maybe } from "~/modules/shared/types";
import { dbWaitForReady } from "~/db";

import { Account, AccountInput } from "../types";

export async function getAccounts(): Promise<Account[]> {
  await dbWaitForReady();
  return Account.find();
}

export async function getAccountById(accountId: number): Promise<Maybe<Account>> {
  await dbWaitForReady();
  return Account.findOneByOrFail({ id: accountId });
}

type UpdateAccountInput = AccountInput & { id: number };
type NewAccountInput = AccountInput & { id: never };
type SaveAccountInput = UpdateAccountInput | NewAccountInput;
export async function saveAccount(input: SaveAccountInput): Promise<void> {
  await dbWaitForReady();
  const account = input.id ? await Account.findOneByOrFail({ id: input.id }) : new Account();
  account.title = input.title;
  account.accountBankType = input.accountBankType;
  account.currency = input.currency;
  await account.save();
}

export async function removeAccount(accountId: number): Promise<void> {
  await dbWaitForReady();
  await Account.delete(accountId);
}
