export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  BRL = 'BRL',
}

export enum AccountBankType {
  CUSTOM = 'CUSTOM',
  N26 = 'N26',
  NUBANK = 'NUBANK',
  WISE = 'WISE',
}

export const CURRENCY_SYMBOLS = {
  [Currency.USD]: '$',
  [Currency.EUR]: '€',
  [Currency.GBP]: '£',
  [Currency.BRL]: 'R$',
} as const;

export const ACCOUNT_BANK_TYPE_LABELS = {
  [AccountBankType.CUSTOM]: 'Custom',
  [AccountBankType.N26]: 'N26',
  [AccountBankType.NUBANK]: 'Nubank',
  [AccountBankType.WISE]: 'Wise',
} as const;