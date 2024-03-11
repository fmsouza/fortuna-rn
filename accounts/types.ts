import { ID } from "shared/types";

import { AccountBankType, Currency } from "./constants";

export type AccountInput = Omit<Account, 'id' | 'createdAt' | 'updatedAt'>;

export type Account = {
  id: ID;
  title: string;
  accountBankType: AccountBankType;
  currency: Currency;
  createdAt: Date;
  updatedAt: Date;
}
