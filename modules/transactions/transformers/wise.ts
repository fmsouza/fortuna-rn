import dayjs from "dayjs";

import { Account } from "~/modules/accounts/types";
import { Maybe } from "~/modules/shared/types";

import { StandardTransactionCategory, TransactionType } from "../constants";
import { TransactionInput } from "../types";

export async function transformer(account: Account, columns: string[], headers: string[]): Promise<Maybe<TransactionInput>> {
  return headers.includes('Status') ? transactionHistoryTransformer(account, columns) : statementsTransformer(account, columns);
}

export async function statementsTransformer(account: Account, columns: string[]): Promise<Maybe<TransactionInput>> {
  const [
    id,                                    // TransferWise ID
    date,                                  // Date
    amountValue,                           // Amount
    _currency,                             // Currency
    description,                           // Description
    _paymentReference,                     // Payment Reference
    _runningBalance,                       // Running Balance
    _exchangeFrom,                         // Exchange From
    _exchangeTo,                           // Exchange To
    _exchangeRate,                         // Exchange Rate
    payerName,                             // Payer Name
    payeeName,                             // Payee Name
    payeeAccountNumber,                    // Payee Account Number
    merchant,                              // Merchant
    _cardLastFourDigits,                   // Card Last Four Digits
    _cardHolderFullName,                   // Card Holder Full Name
    _attachment,                           // Attachment
    _note,                                 // Note
    _totalFees,                            // Total fees
    _assetBaseCurrencyUnitPriceAmount0,    // Asset Base Currency Unit Price Amount-0
    _assetBaseCurrencyUnitPriceCurrency0,  // Asset Base Currency Unit Price Currency-0
    _effectiveTradeRate0,                  // Effective trade rate-0
    _settlementCurrencyUnitPriceAmount0,   // Settlement Currency Unit Price Amount-0
    _settlementCurrencyUnitPriceCurrency0, // Settlement Currency Unit Price Currency-0
    _tradeSide0,                           // Trade Side-0
    _tradedAssetIdType0,                   // Traded Asset Id Type-0
    _tradedAssetIdValue0,                  // Traded Asset Id Value-0
    _tradedUnits0,                         // Traded Units-0
  ] = columns;

  const amount = Number(amountValue) ?? 0;

  const isIncome = amount > 0;
  const isCashback = isIncome && id.toLowerCase().includes('cashback');
  const isTaxes = id.toLowerCase().includes('checkout') || description.toLowerCase().includes('wise charges');
  const isWiseRefunds = isIncome && id.toLowerCase().includes('overcharge');
  const isMerchantRefunds = Boolean(isIncome && merchant);

  let categoryId; {
    switch(true) {
      case isCashback:
        categoryId = StandardTransactionCategory.CASHBACK;
        break;
      case isTaxes:
        categoryId = StandardTransactionCategory.TAXES;
        break;
        case isWiseRefunds:
        case isMerchantRefunds:
          categoryId = StandardTransactionCategory.REFUNDS;
          break;
        case isIncome:
          categoryId = StandardTransactionCategory.INCOME;
          break;
      default:
        categoryId = StandardTransactionCategory.UNKNOWN;
        break;
    }
  };

  return {
      accountId: account.id,
      externalId: id,
      type: isIncome ? TransactionType.INCOME : TransactionType.EXPENSE,
      title: merchant || payeeName && `${payeeName} ${payeeAccountNumber}`.trim() || payerName || description,
      amount: Math.abs(amount),
      origin: payerName,
      details: description,
      categoryId,
      registeredAt: dayjs(date, "DD-MM-YYYY").toDate(),
  };
}

export async function transactionHistoryTransformer(account: Account, columns: string[]): Promise<Maybe<TransactionInput>> {
  const [
    id,                 // ID
    status,             // Status
    direction,          // Direction
    _createdOn,         // Created on
    finishedOn,         // Finished on
    _sourceFeeAmount,   // Source fee amount
    _sourceFeeCurrency, // Source fee currency
    _targetFeeAmount,   // Target fee amount
    _targetFeeCurrency, // Target fee currency
    sourceName,         // Source name
    _sourceAmount,      // Source amount (after fees)
    _sourceCurrency,    // Source currency
    targetName,         // Target name
    targetAmount,       // Target amount (after fees)
    _targetCurrency,    // Target currency
    _exchangeRate,      // Exchange rate
    reference,          // Reference
    _batch              // Batch
  ] = columns;

  if (status !== 'COMPLETED' || direction === 'NEUTRAL') {
    return null;
  }

  return {
      accountId: account.id,
      externalId: id,
      type: direction === 'IN' ? TransactionType.INCOME : TransactionType.EXPENSE, // Direction (IN, OUT)
      title: targetName || reference,
      amount: Number(targetAmount.replace(/,/g, '.') ?? 0),
      origin: sourceName,
      details: '',
      categoryId: StandardTransactionCategory.UNKNOWN,
      registeredAt: dayjs(finishedOn, "YYYY-MM-DD HH:mm:ss").toDate(), // Finished On  \"2023-09-28 19:09:32\"
  };
}
