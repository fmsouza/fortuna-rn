import { Account } from "accounts/types";
import { AccountBankType } from "accounts/constants";
import { Maybe } from "shared/types";

import { TransactionInput } from "../types";
import { sanitizeText } from "../utils";

import { transformer as customTransformer } from "./custom";
import { transformer as n26Transformer } from "./n26";
import { transformer as nubankTransformer } from "./nubank";
import { transformer as wiseTransformer } from "./wise";

type Transformer = (account: Account, columns: string[], headers: string[]) => Promise<Maybe<TransactionInput>>;
const TRANSFORMER_MAP: Record<AccountBankType, Transformer> = {
  [AccountBankType.CUSTOM]: customTransformer,
  [AccountBankType.N26]: n26Transformer,
  [AccountBankType.NUBANK]: nubankTransformer,
  [AccountBankType.WISE]: wiseTransformer,
};

export async function csvToTransactions(account: Account, csv: string): Promise<TransactionInput[]> {
  const transformer: Transformer = TRANSFORMER_MAP[account.accountBankType];
  if (!transformer) {
    throw new Error('Invalid account bank type');
  }
  
  const [headers, ...lines] = csv.trim().split('\n');
  const headerColumns = headers.split(',');
  const processedLines = lines.filter(Boolean).map(line => processLine({line, headers: headerColumns, account, transformer}));
  return (await Promise.all(processedLines)).filter(Boolean) as TransactionInput[];
}

async function processLine(input: {line: string, headers: string[], account: Account, transformer: Transformer}): Promise<Maybe<TransactionInput>> {
  const { line, headers, account, transformer } = input;

  const columns = sanitizeColumns(line, headers);
  if (!columns) {
    return;
  }

  try {
    return await transformer(account, columns, headers);  
  } catch (error) {
    console.log('error', error);
    throw new Error('There was an error processing your CSV, possibly it is not valid for this account type. Please check it and try again.')
  }
}

function sanitizeColumns(line: string, headers: string[]): Maybe<string[]> {
  const columns = replaceCommasWithinQuotes(line).split(',');
  const sanitizedColumns = columns.map(sanitizeText);

  if (sanitizedColumns.length !== headers.length) {
    throw new Error('The CSV you are attempting to load is not valid. Please check it and try again.');
  }

  return sanitizedColumns;
}
function replaceCommasWithinQuotes(line: string): string {
  return line.replace(/"([^"]*)"/g, (match, group) => `"${group.replace(/,/g, ' ')}"`);
}